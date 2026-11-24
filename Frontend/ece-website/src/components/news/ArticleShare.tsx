"use client";

import { useSyncExternalStore } from "react";

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

export default function ArticleShare({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  const url = useSyncExternalStore(subscribe, getUrl, getServerUrl);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const media = url ? encodeURIComponent(new URL(image, url).href) : "";
  const links = [
    {
      name: "Facebook",
      icon: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "X",
      icon: "x",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "WhatsApp",
      icon: "whatsapp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      name: "Pinterest",
      icon: "pinterest",
      href: `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&media=${media}&description=${encodedTitle}`,
    },
    {
      name: "email",
      icon: "email",
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n${url}`)}`,
    },
  ];

  return (
    <nav
      className="flex items-center gap-[calc(12*var(--u))] text-[length:calc(16*var(--u))] leading-[calc(28*var(--u))] font-bold mt-[calc(-4*var(--u))] [@media(max-width:768px)]:gap-0 [@media(max-width:768px)]:text-[14px] [@media(max-width:768px)]:leading-[24px] [@media(max-width:768px)]:mt-0 [@media(max-width:768px)]:flex-wrap"
      aria-label="Share this article"
    >
      <span className="mr-[calc(3*var(--u))] [@media(max-width:768px)]:mr-[6px]">
        Share
      </span>
      {links.map((link) => (
        <a
          key={link.icon}
          href={url ? link.href : undefined}
          className="flex items-center justify-center [@media(max-width:768px)]:w-[36px] [@media(max-width:768px)]:h-[44px]"
          aria-label={`Share via ${link.name}`}
          aria-disabled={!url || undefined}
          target={link.icon === "email" ? undefined : "_blank"}
          rel={link.icon === "email" ? undefined : "noopener noreferrer"}
        >
          <img
            className="w-[calc(28*var(--u))] h-[calc(28*var(--u))] object-contain [@media(max-width:768px)]:w-[24px] [@media(max-width:768px)]:h-[24px]"
            src={`/assets/news-details/${link.icon}.svg`}
            alt=""
            width={28}
            height={28}
          />
        </a>
      ))}
    </nav>
  );
}
