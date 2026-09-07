import { parseBody } from "../../../server/contentBody.js";
import { splitParagraphs } from "../../utils/contentRichText.js";
import RichTextNodes from "./RichTextNodes.jsx";

function FigureBlock({ block }) {
  const imageUrl = String(block.imageUrl || "").trim();
  const caption = String(block.title || "").trim();
  const pullout = String(block.placement || "").toLowerCase() === "pullout";
  const figureLabel = block.type === "image" ? "Image" : "Infographic";
  return (
    <figure className={`content-figure${pullout ? " is-pullout" : " is-inline"}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={caption || figureLabel} />
      ) : (
        <p className="form-note">{figureLabel} not generated yet</p>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function TextBlock({ text }) {
  const paragraphs = splitParagraphs(text);
  if (!paragraphs.length) return null;
  return paragraphs.map((paragraph, index) => (
    <p key={index}>
      <RichTextNodes text={paragraph} />
    </p>
  ));
}

function ListBlock({ block }) {
  const sidebar = String(block.placement || "").toLowerCase() === "sidebar";
  return (
    <aside className={sidebar ? "content-sidebar" : "content-list"}>
      {block.title ? <h3>{block.title}</h3> : null}
      <ul>
        {(block.items || []).map((item, index) => (
          <li key={index}>
            <RichTextNodes text={item} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

function QuoteBlock({ block }) {
  const credit = [block.speaker, block.title].filter(Boolean).join(" · ");
  return (
    <blockquote className="article-quote">
      <p>
        “<RichTextNodes text={block.text} />”
      </p>
      {credit ? <cite>{credit}</cite> : null}
    </blockquote>
  );
}

function HeadingBlock({ block }) {
  const text = String(block.text || "").trim();
  if (!text) return null;
  if (block.level === 3) return <h3>{text}</h3>;
  return <h2>{text}</h2>;
}

export default function ArticleBody({ body }) {
  const blocks = parseBody(body);
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "heading") return <HeadingBlock key={`heading-${index}`} block={block} />;
        if (block.type === "quote") return <QuoteBlock key={`quote-${index}`} block={block} />;
        if (block.type === "list") return <ListBlock key={`list-${index}`} block={block} />;
        if (block.type === "image" || block.type === "infographic") {
          return <FigureBlock key={`${block.type}-${index}`} block={block} />;
        }
        if (block.type === "html") {
          return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: block.html || "" }} />;
        }
        return <TextBlock key={`text-${index}`} text={block.text} />;
      })}
    </>
  );
}
