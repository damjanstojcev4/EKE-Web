import { externalUrl } from "@/lib/api/client";
import { Fragment } from "react";
import type { ArticleContentBlock, ArticleText } from "@/types/news";
import PendingControl from "./PendingControl";

export function ArticleTextRuns({ runs }: { runs: ArticleText[] }) {
  return runs.map((run, index) => {
    const text = run.strong ? <strong>{run.text}</strong> : run.text;
    return (
      <Fragment key={index}>
        {run.pendingLink ? (
          <PendingControl
            label="Project details (destination unavailable)"
            message="The project details destination has not been supplied."
          >
            {text}
          </PendingControl>
        ) : externalUrl(run.href) ? (
          <a href={externalUrl(run.href)}>{text}</a>
        ) : (
          text
        )}
      </Fragment>
    );
  });
}

export default function ArticleContent({
  blocks,
}: {
  blocks: ArticleContentBlock[];
}) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "heading":
        return <h2 key={index}>{block.text}</h2>;
      case "paragraph":
        return (
          <p key={index}>
            <ArticleTextRuns runs={block.text} />
          </p>
        );
      case "list":
        return (
          <ul key={index}>
            {block.items.map((item) => (
              <li key={item.title}>
                <span>{item.title}</span>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        );
    }
  });
}
