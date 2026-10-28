import { Fragment } from "react";

export default function EmphasizedText({
  text,
  phrases,
}: {
  text: string;
  phrases: string[];
}) {
  const parts: { text: string; bold: boolean }[] = [];
  let rest = text;
  while (rest) {
    const next = phrases
      .map((phrase) => ({ phrase, index: rest.indexOf(phrase) }))
      .filter((item) => item.index >= 0)
      .sort((a, b) => a.index - b.index)[0];
    if (!next) {
      parts.push({ text: rest, bold: false });
      break;
    }
    if (next.index)
      parts.push({ text: rest.slice(0, next.index), bold: false });
    parts.push({ text: next.phrase, bold: true });
    rest = rest.slice(next.index + next.phrase.length);
  }
  return parts.map((part, i) =>
    part.bold ? (
      <strong key={i}>{part.text}</strong>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    ),
  );
}
