// import "./tiptap-render.css";
// interface Props {
//   html: string;
//   className?: string;
// }

// export default function TiptapRenderer({ html, className = "" }: Props) {
//   return (
//     <div
//       className={`tiptap-render ${className}`}
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   );
// }
import "./tiptap-render.css";

interface Props {
  html: string;
  className?: string;
}

/**
 * Escape HTML characters.
 * This is important when rendering plain text
 * through dangerouslySetInnerHTML.
 */
const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Check whether content is already HTML.
 *
 * Tiptap content usually contains tags such as:
 * <p>, <h2>, <strong>, <ul>, etc.
 */
const isHtmlContent = (content: string) => {
  return /<\/?[a-z][\s\S]*>/i.test(content);
};

/**
 * Convert plain TXT content into readable HTML.
 *
 * Example:
 *
 * অধ্যায় ১: ফিরে আসা
 *
 * প্রথম paragraph...
 *
 * দ্বিতীয় paragraph...
 *
 * অধ্যায় ২: বাবার চিঠি
 */
const convertPlainTextToHtml = (content: string) => {
  const normalizedContent = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (!normalizedContent) {
    return "";
  }

  const lines = normalizedContent.split("\n");

  const html: string[] = [];

  let paragraphLines: string[] = [];

  /**
   * Convert currently collected lines
   * into one paragraph.
   */
  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    const paragraphText = paragraphLines.join(" ").replace(/\s+/g, " ").trim();

    if (paragraphText) {
      html.push(`<p>${escapeHtml(paragraphText)}</p>`);
    }

    paragraphLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    /**
     * Empty line means paragraph break.
     */
    if (!line) {
      flushParagraph();
      continue;
    }

    /**
     * Chapter heading.
     *
     * Supports:
     * অধ্যায় ১
     * অধ্যায় ১
     * অধ্যায় ১: ফিরে আসা
     * অধ্যায় ২: বাবার চিঠি
     */
    if (/^অধ্যা[য়য়]\s*\d+/u.test(line)) {
      flushParagraph();

      html.push(`
        <h2>${escapeHtml(line)}</h2>
      `);

      continue;
    }

    /**
     * Ending headings.
     */
    if (
      line === "শেষ অধ্যায়" ||
      line === "শেষ অধ্যায়" ||
      line === "শেষ অধ্যায়:" ||
      line === "শেষ অধ্যায়:" ||
      line === "সমাপ্ত" ||
      line === "সমাপ্ত।"
    ) {
      flushParagraph();

      html.push(`
        <h2>${escapeHtml(line)}</h2>
      `);

      continue;
    }

    /**
     * Detect quotation.
     *
     * Example:
     * “মানুষ যত দূরেই যাক...”
     */
    if (
      (line.startsWith("“") && line.endsWith("”")) ||
      (line.startsWith('"') && line.endsWith('"'))
    ) {
      flushParagraph();

      html.push(`
        <blockquote>${escapeHtml(line)}</blockquote>
      `);

      continue;
    }

    /**
     * Normal paragraph line.
     */
    paragraphLines.push(line);
  }

  /**
   * Flush remaining paragraph.
   */
  flushParagraph();

  return html.join("");
};

export default function TiptapRenderer({ html, className = "" }: Props) {
  const content = html?.trim() || "";

  /**
   * If content is already HTML from Tiptap,
   * don't modify it.
   *
   * If content is plain TXT,
   * convert it into HTML first.
   */
  const renderedContent = isHtmlContent(content)
    ? content
    : convertPlainTextToHtml(content);

  return (
    <div
      className={`tiptap-render ${className}`}
      dangerouslySetInnerHTML={{
        __html: renderedContent,
      }}
    />
  );
}
