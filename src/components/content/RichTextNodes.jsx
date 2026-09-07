import { Fragment } from "react";
import { parseInlineMarkdown } from "../../utils/contentRichText.js";

export default function RichTextNodes({ text }) {
  const parts = parseInlineMarkdown(text);
  return parts.map((part, index) => {
    if (part.type === "bold") return <strong key={index}>{part.text}</strong>;
    if (part.type === "italic") return <em key={index}>{part.text}</em>;
    if (part.type === "link" && part.href) {
      return (
        <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">
          {part.text || part.href}
        </a>
      );
    }
    return <Fragment key={index}>{part.text}</Fragment>;
  });
}
