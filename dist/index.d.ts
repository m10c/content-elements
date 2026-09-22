import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';
import { FieldProp } from 'react-typed-form';
export { usePreviewSender, useWebsiteGlobalData, useWebsitePageData } from './hooks.js';

type SimpleFieldKind = 'text' | 'textarea' | 'richtext' | 'markdown' | 'icon' | 'image' | 'images' | 'choice' | 'toggle' | 'note';
type FieldOption = {
    value: string;
    label: string;
};
type SimpleField = {
    kind: SimpleFieldKind;
    label?: string;
    /** Marks the label with an asterisk. */
    required?: boolean;
    maxLength?: number;
    /** Markdown feature flags, e.g. ['bold', 'italic', 'lists', 'links'] */
    features?: string[];
    /** Guidance under the label, e.g. the dimensions an image should have. */
    hint?: string;
    /** Fixed text before the input, e.g. a currency symbol. */
    prefix?: string;
    /** What a `note` field says in place of an input. */
    text?: string;
    /** What a `choice` field offers. */
    options?: FieldOption[];
    /** Caps how many an `images` field holds. */
    maxItems?: number;
};
type ListField = {
    kind: 'list';
    label?: string;
    /** Marks the label with an asterisk. */
    required?: boolean;
    itemLabel?: string;
    minItems?: number;
    maxItems?: number;
    /**
     * `inline` lists every item's fields one after another, and items can only be
     * edited. `cards` shows each item as a summary card that opens a dialog to
     * edit, and lets an admin add and delete items.
     */
    variant?: 'inline' | 'cards';
    /**
     * Sibling fields of the same block to render under this list's heading, e.g.
     * a subtitle that introduces the items. They are skipped where they would
     * otherwise appear in the block.
     */
    headerFieldKeys?: string[];
    /**
     * Placeholders an admin can type into this list's fields, listed at the top
     * of the dialog that edits an item.
     */
    variables?: {
        token: string;
        description: string;
    }[];
    itemFields: Record<string, SimpleField>;
};
type BlockTypeField = SimpleField | ListField;
type BlockType = {
    key: string;
    label: string;
    /** Hides the block's heading, for a block whose single field is titled. */
    hideLabel?: boolean;
    fields: Record<string, BlockTypeField>;
};
/**
 * Boundary type for the `blockTypes` prop. Consumers pass block types straight
 * from their generated `/block-types` endpoint, whose schema can't express the
 * rich `fields` metadata (it commonly generates as `string[]`). We accept the
 * structural minimum here and narrow `fields` to `BlockType` internally, so
 * consumers never need to cast or import `BlockType`.
 */
type BlockTypeInput = {
    key: string;
    label: string;
    fields: unknown;
};
type Block = {
    type: string;
    data: Record<string, unknown>;
};
type BlockFieldRendererProps = {
    name: string;
    label: string;
    value: string | null;
    /** The formats the field's schema allows, e.g. ['bold', 'link']. */
    features?: string[];
    /** Guidance under the label, e.g. the dimensions an image should have. */
    hint?: string;
    /** Fixed text before the input, e.g. a currency symbol. */
    prefix?: string;
    /** A validation message for the field, e.g. from the server. */
    error?: string;
    /** The saved values of a field that holds several, e.g. `images`. */
    values?: string[];
    /** Caps how many values a field that holds several accepts. */
    maxItems?: number;
    /** Whether a `toggle` field is on. */
    checked?: boolean;
    onChange: (value: string | null) => void;
    /** Replaces the values of a field that holds several. */
    onChangeValues?: (values: string[]) => void;
    /** Turns a `toggle` field on or off. */
    onChangeChecked?: (checked: boolean) => void;
};
type BlockFieldRenderer = (props: BlockFieldRendererProps) => React.ReactNode;
type BlockFieldRenderers = Partial<Record<SimpleFieldKind | string, BlockFieldRenderer>>;
/**
 * Validation messages keyed by field path: `<block>.<field>` for a simple
 * field, `<block>.<field>.<item>.<subField>` inside a list.
 */
type BlockErrors = Record<string, string>;
/**
 * Draws a field's saved value inside a card summary, e.g. the icon a slug
 * names. Without one the value is shown as text.
 */
type BlockFieldPreview = (value: string | null) => React.ReactNode;
type BlockFieldPreviews = Partial<Record<SimpleFieldKind | string, BlockFieldPreview>>;

/** Icons a consumer can swap for its own icon set. */
type ListCardIcons = {
    drag?: React$1.ReactNode;
    edit?: React$1.ReactNode;
};
type Props$3 = {
    blockTypes: readonly BlockTypeInput[];
    field: FieldProp<Block[]>;
    renderers?: BlockFieldRenderers;
    previews?: BlockFieldPreviews;
    icons?: ListCardIcons;
    errors?: BlockErrors;
};
declare function BlocksField({ blockTypes, field, renderers, previews, icons, errors, }: Props$3): react_jsx_runtime.JSX.Element;

type PreviewWidth = 'desktop' | 'tablet' | 'mobile';
type Props$2 = {
    blockTypes: readonly BlockTypeInput[];
    field: FieldProp<Block[]>;
    renderers?: BlockFieldRenderers;
    previews?: BlockFieldPreviews;
    icons?: ListCardIcons;
    errors?: BlockErrors;
    /** Names for the preview's device sizes, e.g. 'Mobile website'. */
    deviceLabels?: Partial<Record<PreviewWidth, string>>;
    /** Site origin for the preview iframe and postMessage target. */
    previewUrl: string;
    pagePath: string;
    /** The site's route for the page, where it differs from the CMS path. */
    previewPath?: string;
    previewContent: Record<string, unknown>;
    /** CMS paths that are global pages (footer, navigation, …). */
    globalPagePaths?: readonly string[];
    isSaving?: boolean;
    /** Greys out publishing for an admin who may only view. */
    publishDisabled?: boolean;
    onPublish: () => void;
};
declare function PageEditor({ blockTypes, field, renderers, previews, icons, errors, deviceLabels, previewUrl, pagePath, previewPath, previewContent, globalPagePaths, isSaving, publishDisabled, onPublish, }: Props$2): react_jsx_runtime.JSX.Element;

type Props$1<T extends {
    publishAt: string | null;
}> = {
    item: T;
};
declare function PublishState<T extends {
    publishAt: string | null;
}>({ item, }: Props$1<T>): react_jsx_runtime.JSX.Element;

type Props = {
    pageTitleField: FieldProp<string | null>;
    descriptionField: FieldProp<string | null>;
    /** Draws the text fields, for an app whose inputs look nothing like these. */
    renderers?: BlockFieldRenderers;
    imageField?: FieldProp<string | null>;
    renderImageField?: (field: FieldProp<string | null>) => React$1.ReactNode;
    imagePreviewUrl?: string;
    /** The image the site shares when a page names none of its own. */
    fallbackImageUrl?: string;
    /** The site's favicon, shown next to the URL in the search preview (search
     * engines use the favicon here, not the social/OG image). */
    faviconUrl?: string;
    fallbackTitle: string;
    siteName?: string;
    isSaving?: boolean;
    /** Greys out publishing for an admin who may only view. */
    publishDisabled?: boolean;
    onPublish: () => void;
};
declare function SeoEditor({ pageTitleField, descriptionField, renderers, imageField, renderImageField, imagePreviewUrl, fallbackImageUrl, faviconUrl, fallbackTitle, siteName, isSaving, publishDisabled, onPublish, }: Props): react_jsx_runtime.JSX.Element;

export { type Block, type BlockErrors, type BlockFieldPreview, type BlockFieldPreviews, type BlockFieldRenderer, type BlockFieldRendererProps, type BlockFieldRenderers, type BlockType, type BlockTypeField, type BlockTypeInput, BlocksField, type FieldOption, type ListCardIcons, type ListField, PageEditor, PublishState, SeoEditor, type SimpleField, type SimpleFieldKind };
