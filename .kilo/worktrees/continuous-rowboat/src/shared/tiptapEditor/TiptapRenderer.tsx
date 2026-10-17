import "./tiptap-render.css";
interface Props {
  html: string;
  className?: string;
}

export default function TiptapRenderer({ html, className = "" }: Props) {
  return (
    <div
      className={`tiptap-render ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
