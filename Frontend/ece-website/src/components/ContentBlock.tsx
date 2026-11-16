import type { ElementType, ReactNode } from "react";
export type ContentBlockData = { readonly className: string; readonly content: ReactNode };
export default function ContentBlock({ block, as: Tag = "div", className = "" }: { block: ContentBlockData; as?: ElementType; className?: string }) {
 return <Tag className={["content-block", block.className, className].filter(Boolean).join(" ")}>{block.content}</Tag>;
}
