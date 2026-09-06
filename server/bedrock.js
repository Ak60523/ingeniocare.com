import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

/** Same model Growgent uses for structured editorial generation. */
export const SONNET_FOUNDATION_MODEL_ID = "anthropic.claude-sonnet-4-5-20250929-v1:0";
export const BEDROCK_MAX_COMPLETION_TOKENS = 8192;

function bedrockRegion() {
  return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
}

function bedrockGeoPrefixForRegion(region) {
  const r = (region || "us-east-1").toLowerCase();
  if (r.startsWith("eu-")) return "eu";
  if (r.startsWith("us-") || r.startsWith("ca-") || r.startsWith("mx-") || r.startsWith("us-gov-")) return "us";
  if (r === "ap-southeast-2" || r === "ap-southeast-4" || r === "ap-southeast-6") return "au";
  if (r === "ap-northeast-1" || r === "ap-northeast-3") return "jp";
  if (r.startsWith("ap-") || r.startsWith("sa-") || r.startsWith("me-") || r.startsWith("af-") || r.startsWith("il-")) {
    return "global";
  }
  return "us";
}

function normalizeToInferenceProfileId(modelId, region) {
  const m = String(modelId || "").trim();
  if (!m || m === SONNET_FOUNDATION_MODEL_ID) {
    return `${bedrockGeoPrefixForRegion(region)}.${SONNET_FOUNDATION_MODEL_ID}`;
  }
  if (/^(us|eu|au|jp|global)\.anthropic\./i.test(m)) return m;
  return m;
}

export function getBedrockSonnetModelId(region = bedrockRegion()) {
  const override = process.env.BEDROCK_SONNET_MODEL_ID?.trim();
  if (override) return normalizeToInferenceProfileId(override, region);
  return normalizeToInferenceProfileId(SONNET_FOUNDATION_MODEL_ID, region);
}

function extractJsonFromModel(text) {
  let t = String(text || "").trim();
  const fenceMatch = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) t = fenceMatch[1].trim();
  else if (/^```/i.test(t)) t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const objStart = t.indexOf("{");
  const objEnd = t.lastIndexOf("}");
  if (objStart >= 0 && objEnd > objStart) return t.slice(objStart, objEnd + 1);
  return t;
}

function tokenCaps(requested) {
  const a = Math.max(256, Math.min(BEDROCK_MAX_COMPLETION_TOKENS, Math.floor(requested)));
  if (a >= 6000) return a >= BEDROCK_MAX_COMPLETION_TOKENS ? [a] : [a, BEDROCK_MAX_COMPLETION_TOKENS];
  const b = Math.min(BEDROCK_MAX_COMPLETION_TOKENS, Math.max(a + 1, a * 2));
  return Array.from(new Set([a, b]));
}

async function converse({ modelId, system, user, maxTokens }) {
  const region = bedrockRegion();
  const client = new BedrockRuntimeClient({ region });
  const out = await client.send(
    new ConverseCommand({
      modelId,
      system: system ? [{ text: system }] : undefined,
      messages: [{ role: "user", content: [{ text: user }] }],
      inferenceConfig: { maxTokens },
    })
  );
  const blocks = out.output?.message?.content ?? [];
  let text = "";
  for (const block of blocks) {
    if (typeof block?.text === "string") text += block.text;
  }
  return {
    text: text.trim(),
    stopReason: out.stopReason,
  };
}

export async function bedrockJsonRequest(systemPrompt, userPrompt, maxTokens = 4096, options = {}) {
  const modelId = options.modelId || getBedrockSonnetModelId();
  const caps = tokenCaps(maxTokens);
  let lastError = "AI generation failed";

  for (let i = 0; i < caps.length; i += 1) {
    try {
      const result = await converse({
        modelId,
        system: systemPrompt,
        user: userPrompt,
        maxTokens: caps[i],
      });
      if (!result.text) {
        lastError = "Bedrock returned empty content.";
        continue;
      }
      try {
        return { ok: true, parsed: JSON.parse(extractJsonFromModel(result.text)), raw: result };
      } catch {
        if (result.stopReason === "max_tokens" && i < caps.length - 1) continue;
        return {
          ok: false,
          statusCode: 502,
          message: "AI returned unreadable JSON. Try again with a shorter request.",
        };
      }
    } catch (err) {
      const name = err?.name || "";
      const message = err?.message || String(err);
      if (/CredentialsProviderError|Could not load credentials|Missing credentials/i.test(name + message)) {
        return {
          ok: false,
          statusCode: 503,
          message: "AWS credentials are not configured for Bedrock. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.",
        };
      }
      const statusCode =
        name === "ValidationException" ? 400 : name === "ThrottlingException" || name === "ServiceUnavailableException" ? 429 : 502;
      return { ok: false, statusCode, message };
    }
  }

  return { ok: false, statusCode: 502, message: lastError };
}
