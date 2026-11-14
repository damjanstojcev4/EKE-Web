"use client";

import { useSyncExternalStore } from "react";
import styles from "@/app/news/[slug]/page.module.css";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
};
const getUrl = () => window.location.href;
const getServerUrl = () => "";

export default function ArticleShare({ title, image }: { title: string; image: string }) {
  const url = useSyncExternalStore(subscribe, getUrl, getServerUrl);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const media = url ? encodeURIComponent(new URL(image, url).href) : "";
  const links = [
    { name: "Facebook", icon: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "LinkedIn", icon: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: "X", icon: "x", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: "WhatsApp", icon: "whatsapp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: "Pinterest", icon: "pinterest", href: `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&media=${media}&description=${encodedTitle}` },
    { name: "email", icon: "email", href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n${url}`)}` },
  ];

  return <nav className={styles.share} aria-label="Share this article">
    <span>Share</span>
    {links.map(link => <a key={link.icon} href={url ? link.href : undefined}
      aria-label={`Share via ${link.name}`} aria-disabled={!url || undefined}
      target={link.icon === "email" ? undefined : "_blank"}
      rel={link.icon === "email" ? undefined : "noopener noreferrer"}>
      <img src={`/assets/news-details/${link.icon}.svg`} alt="" width={28} height={28} />
    </a>)}
  </nav>;
}
