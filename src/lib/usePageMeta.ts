import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

const SITE_ORIGIN = "https://www.snowbuddy.co.uk";

function setNamedMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Keeps <title>, meta description, canonical and OG/Twitter tags in sync with the current route. */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;
    document.title = title;

    setNamedMeta("name", "description", description);
    setNamedMeta("property", "og:title", title);
    setNamedMeta("property", "og:description", description);
    setNamedMeta("property", "og:url", url);
    setNamedMeta("name", "twitter:title", title);
    setNamedMeta("name", "twitter:description", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, path]);
}
