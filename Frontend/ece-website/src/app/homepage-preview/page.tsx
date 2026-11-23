import { createMetadata, seoPages } from "@/lib/seo";

export const metadata = createMetadata({ ...seoPages.home, noindex: true });

export { default } from "../page";
