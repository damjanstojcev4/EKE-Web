"use client";
import { useEffect, useRef, useState } from "react";

export default function ProjectImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [failed, setFailed] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // A failed server-rendered image may finish before React attaches onError.
    const element = image.current;
    if (element?.complete && element.naturalWidth === 0) {
      element.dispatchEvent(new Event("error"));
    }
  }, []);
  return failed ? (
    <span role="img" aria-label={alt}>
      {alt} — image unavailable
    </span>
  ) : (
    <img
      ref={image}
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setFailed(true)}
    />
  );
}
