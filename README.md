# Content Elements

A React library that adds small "elements" of CMS functionality. It powers a block-based page
editor in the **admin** app and renders that content (with live preview) in the
**web** app. It pairs with `@m10c/mui-kit` for the underlying form/theme
primitives.

A page is a list of typed **blocks** — e.g. a hero, an info section, feature
cards. Each block has a `type` and a `data` object. The admin app edits this
list of blocks; the web app reads it and renders each block. The shared `Block`
types keep both sides in agreement on the shape of that data.

## Admin editor

The editor is two components:

- **`PageEditor`** — edits the page's blocks. It renders a form for the block
  list on one side and a live preview iframe (pointed at the web app) on the
  other. `field` is a [`react-typed-form`](https://www.npmjs.com/package/react-typed-form) field holding the
  `Block[]`; `previewUrl` is the deployed web app's origin; `pagePath` is the
  page being edited (`'home'` maps to the site root). `previewContent` is the
  current form state, which is what gets streamed to the preview.
- **`SeoEditor`** — edits a page's SEO title, description, and share image.

```typescript
import { PageEditor } from '@m10c/content-elements';

<PageEditor
  blockTypes={blockTypes}
  field={form.getField('blocks')}
  previewUrl={websitePreviewUrl}
  pagePath={page.path}
  previewContent={form.values}
  onPublish={() => form.handleSubmit()}
/>
```

Each block field can be rendered with a custom input by passing `renderers`
(e.g. a rich-text or image-upload field for certain field kinds); otherwise a
default input is used.

For an editor with its own layout (e.g. a content piece with a title, summary,
and free-form blocks), `BlocksField`, `PreviewLayout`, and `LivePreview` (the
pieces `PageEditor` is built from) can be composed directly.

## Localisation

Localised content is an **identity** (e.g. a content piece) with one
**variant** per value of a **dimension**, typically a variant per locale.
Editors switch between variants, edit and save each one, publish or unpublish
it, and start a new one by translating an existing variant.

`useVariantEditor` drives a variant editing screen:

```typescript
import { useVariantEditor } from '@m10c/content-elements';

const editor = useVariantEditor({
  identityIri: content['@id'],
  variantsPath: '/content-variants',
  entityLabel: 'Content',
  listPath: '/content',
  variants,
  toFormValues,
});
```

It returns the selected variant, a form that resets cleanly when switching,
an unsaved-changes guard, and the save/publish/translate actions. The selected
variant is kept in the URL. The layout is left to the screen, with
`DimensionSelect`, `ConfirmDialog`, and `UnsavedChangesDialog` for the common
parts. It relies on a `VariantEditorProvider` mounted once at the admin app's
root, which supplies the API client, toasts, router, and default dimension.

## Website data fetching

Fetch the page on the server, pass it to `useWebsitePageData` as `initialData`,
and render the blocks it returns:

```typescript
import { useWebsitePageData } from '@m10c/content-elements/hooks';

const { data } = useWebsitePageData({ path: 'about', initialData });
// render each block by its type…
```

`useWebsitePageData` returns the server-fetched content for the live page, and
transparently swaps in preview content when the page is open inside the editor
(see below).

For site-wide content like a footer, `useWebsiteGlobalData` works
the same way but reads a global by its CMS path (e.g. `'footer'`).

## Live preview

While editing, the admin shows the web app in an iframe and streams the
in-progress edits into it, so the page updates instantly without saving. The
admin side is handled by `PageEditor`; the web side by `useWebsitePageData` — neither app needs extra setup.

The only requirement is that the admin's `previewUrl` is set to the web app's
exact origin (matching scheme, host, and port), since that's the page the editor loads and sends edits to.
