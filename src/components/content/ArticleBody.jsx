import { parseBody } from "../../../server/contentBody.js";

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

export default function ArticleBody({ body }) {
  const blocks = parseBody(body);
  if (!blocks.length) return null;
  if (blocks.length === 1 && blocks[0].type === "html") {
    return <div dangerouslySetInnerHTML={{ __html: blocks[0].html || "" }} />;
  }
  return (
    <>
      {blocks.map((block, index) =>
        block.type === "image" || block.type === "infographic" ? (
          <FigureBlock key={`${block.type}-${index}`} block={block} />
        ) : (
          <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: block.html || "" }} />
        )
      )}
    </>
  );
}
