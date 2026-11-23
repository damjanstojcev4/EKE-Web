import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canonicalUrl,
  createMetadata,
  getSiteConfig,
  plainText,
  seoPages,
  serializeJsonLd,
  socialImage,
  summarize,
  titleWithSite,
} from "../src/lib/seo.ts";

test("indexing requires explicit production configuration", () => {
  assert.equal(getSiteConfig({}).indexable, false);
  assert.equal(
    getSiteConfig({
      NODE_ENV: "production",
      SEO_ENVIRONMENT: "staging",
      PRODUCTION_SITE_URL: "https://ekebitola.org",
    }).indexable,
    false,
  );
  assert.equal(
    getSiteConfig({
      NODE_ENV: "development",
      SEO_ENVIRONMENT: "production",
      PRODUCTION_SITE_URL: "https://ekebitola.org",
    }).indexable,
    false,
  );
  assert.equal(
    getSiteConfig({
      NODE_ENV: "production",
      SEO_ENVIRONMENT: "production",
      PRODUCTION_SITE_URL: "https://ekebitola.org",
    }).indexable,
    true,
  );
  assert.throws(
    () => getSiteConfig({ SEO_ENVIRONMENT: "production" }),
    /required/,
  );
  for (const url of [
    "http://ekebitola.org",
    "https://preview.eke.mk",
    "https://localhost",
    "https://example.org/subpath",
    "https://user:pass@example.org",
    "https://127.0.0.1",
    "https://example.org?preview=1",
  ]) {
    assert.throws(() => getSiteConfig({ PRODUCTION_SITE_URL: url }));
  }
});

test("descriptions remove markup, decode entities, and end at word boundaries", () => {
  assert.equal(
    plainText(
      "<p>Hello&nbsp; &amp; <b>welcome</b>.</p><script>alert(1)</script>",
    ),
    "Hello & welcome .",
  );
  assert.equal(plainText("&#x1F30D; &#39;learning&#39;"), "🌍 'learning'");
  const long =
    "Learning brings people together. " +
    "Community education and participation improve opportunities. ".repeat(5);
  const result = summarize(long);
  assert.ok(result.length <= 160);
  assert.ok(!result.endsWith("opport…"));
  assert.equal(summarize("One clear sentence."), "One clear sentence.");
  assert.equal(summarize("A".repeat(200)), "…");
});

test("JSON-LD cannot close its script element or inject HTML", () => {
  const value = {
    headline: '</script><script>alert("test")</script> & text\u2028\u2029',
  };
  const serialized = serializeJsonLd(value);
  assert.ok(!serialized.includes("<"));
  assert.ok(!serialized.includes("&"));
  assert.deepEqual(JSON.parse(serialized), value);
});

test("metadata has one suffix, per-page canonicals, matching social tags, and no missing image URLs", () => {
  const original = { ...process.env };
  try {
    process.env.PRODUCTION_SITE_URL = "https://ekebitola.org";
    process.env.SEO_ENVIRONMENT = "production";
    process.env.NODE_ENV = "production";
    assert.equal(titleWithSite("Project | EKE | EKE"), "Project | EKE");
    assert.equal(titleWithSite("Project — EKE Bitola"), "Project | EKE");
    assert.equal(
      canonicalUrl("/news/story"),
      "https://ekebitola.org/news/story/",
    );
    assert.throws(() => canonicalUrl("//another.example"));
    assert.throws(() => canonicalUrl("/news?test=1"));
    assert.equal(socialImage("/missing.webp"), undefined);
    assert.equal(socialImage("/images/seo/home-og.webp"), undefined);
    assert.equal(socialImage("/../package.json"), undefined);
    assert.equal(
      socialImage("https://unverified.example/image.png"),
      undefined,
    );
    for (const page of Object.values(seoPages)) {
      const meta = createMetadata(page);
      assert.equal(meta.title.absolute, `${page.title} | EKE`);
      assert.equal(meta.description, page.description);
      assert.equal(meta.openGraph.title, meta.title.absolute);
      assert.equal(meta.twitter.description, page.description);
      assert.equal(meta.robots.index, true);
      assert.equal(meta.alternates.canonical, canonicalUrl(page.path));
      assert.deepEqual(meta.openGraph.images, []);
    }
    assert.equal(
      createMetadata({ ...seoPages.projects, noindex: true }).robots.index,
      false,
    );
    process.env.SEO_ENVIRONMENT = "staging";
    assert.equal(createMetadata(seoPages.home).robots.index, false);
  } finally {
    process.env = original;
  }
});
