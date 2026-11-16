# Site content

- `site-content.tsx` holds named rich-text entries, including intentional emphasis and line breaks.
- `service-copy.ts` holds plain text for impact statistics and partnership services.
- Page-specific content remains with its existing About, Projects and Opportunities content modules.

Sections import content explicitly and pass rich-text entries to `ContentBlock`. Use meaningful names such as `heroIntro` or `teamHeading`; content does not depend on design-tool identifiers. Choose the semantic element with `as` (`h2`, `h3`, or the default `div`).

The `content-block` class is shared by typography and text-reveal styles. Entry formatting currently preserves the approved layout; change it deliberately when editing line breaks or emphasis.
