import { FormObject } from 'react-typed-form';

declare const PREVIEW_MESSAGE: {
    readonly content: "m10c-cms-preview";
    readonly ready: "m10c-cms-preview-ready";
};

type SimpleFieldKind = 'text' | 'textarea' | 'richtext' | 'markdown' | 'icon' | 'image' | 'images' | 'select' | 'boolean' | 'note';
type SimpleField = {
    kind: SimpleFieldKind;
    label?: string;
    /** Marks the label with an asterisk. */
    required?: boolean;
    maxLength?: number;
    /** Markdown feature flags, e.g. ['bold', 'italic', 'lists', 'links'] */
    features?: string[];
    /** Guidance under the label. */
    hint?: string;
    /** The size an image should be, e.g. '480x320', shown as a hint. */
    dimensions?: string;
    /** Fixed text before the input, e.g. a currency symbol. */
    prefix?: string;
    /** What a `note` field says in place of an input. */
    text?: string;
    /** What a `select` field offers. */
    options?: string[];
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
     * `cards` (the default) shows each item as a summary card that opens a
     * dialog to edit, and lets an admin add and delete items. `inline` lists
     * every item's fields one after another, and items can only be edited.
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
    /** Whether a `boolean` field is on. */
    checked?: boolean;
    onChange: (value: string | null) => void;
    /** Replaces the values of a field that holds several. */
    onChangeValues?: (values: string[]) => void;
    /** Turns a `boolean` field on or off. */
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
type VariantBase = {
    '@id': string;
    publishAt?: string | null;
    updatedAt?: string;
};
type VariantDetailBase = {
    '@id': string;
    updatedAt?: string;
};
type DimensionOption = {
    value: string;
    label: string;
};
type DimensionChip = {
    label: string;
    color: 'default' | 'success' | 'warning' | 'info';
};
type Dimension = {
    key: string;
    label: string;
    pluralLabel: string;
    options: readonly DimensionOption[];
    translatable?: boolean;
};
type Translations = Record<string, unknown>;
type UnsavedChangesGuard = {
    guard: (action: () => void) => void;
    guardNavigate: (navigate: () => void) => Promise<boolean>;
    hasUnsavedChanges: boolean;
    hasPending: boolean;
    handlePending: (save: boolean) => Promise<void>;
    dismissPending: () => void;
};
type VariantEditorState<V extends VariantBase, D extends VariantDetailBase, T extends Record<string, unknown>> = {
    dimension: Dimension;
    value: string;
    isDefault: boolean;
    currentVariant: V | null;
    currentDetail: D | null;
    sourceVariant: V | null;
    isLoadingDetail: boolean;
    hasDetailError: boolean;
    reloadDetail: () => void;
    getLabel: (value: string) => string;
    getChips: (value: string) => DimensionChip[];
    form: FormObject<Partial<T>>;
    guard: UnsavedChangesGuard;
    canTranslate: boolean;
    isTranslating: boolean;
    isPublished: boolean;
    isNewVariant: boolean;
    isLastVariant: boolean;
    switchTo: (value: string) => void;
    save: () => Promise<boolean>;
    publish: (publishAt: string) => Promise<boolean>;
    unpublish: () => Promise<boolean>;
    remove: () => Promise<boolean>;
    translate: (fields: string[]) => Promise<Translations | null>;
    invalidate: () => void;
};
type VariantEditorConfig = {
    callApi: CallApi;
    toast: {
        success: (message: string) => void;
    };
    push: (href: string) => void;
    getParams: () => Record<string, string | undefined>;
    setParams: (next: Record<string, string>) => void;
    defaultDimension: Dimension;
};
type CallApi = <R>(path: string, requestOptions?: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    jsonBody?: unknown;
}, moreOptions?: {
    addSubmitError?: (field: string, error: string) => void;
}) => Promise<{
    data: R;
} | undefined>;
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
type PreviewMessage = {
    type: typeof PREVIEW_MESSAGE.content;
    content: Record<string, unknown>;
    pagePath?: string;
    globals?: Record<string, unknown>;
};
type UseWebsitePageDataResult = {
    data: Record<string, unknown>;
    isPreview: boolean;
    isLoading: boolean;
};
type ListItem = Record<string, unknown>;
type BlockComponentProps = {
    block: Block;
    onChange: (data: Record<string, unknown>) => void;
    errors?: BlockErrors;
    errorPath: string;
    headerActionContainer: HTMLElement | null;
};

type UsePreviewReceiverConfig = {
    pagePath: string;
    enabled?: boolean;
    /** Origins allowed to send content. Any origin is accepted when left out. */
    allowedOrigins?: readonly string[];
};
declare function usePreviewReceiver<T = Record<string, unknown>>({ pagePath, enabled, allowedOrigins, }: UsePreviewReceiverConfig): T | null;

type UsePreviewSenderConfig = {
    /** The full preview URL to load in the iframe */
    previewUrl: string;
    /** The current form content to send to the preview */
    content: Record<string, unknown>;
    /** The current page path */
    pagePath?: string;
    /** Global content (footer, navigation, …) keyed by page path. */
    globals?: Record<string, unknown>;
};
type UsePreviewSenderResult = {
    /** Ref to attach to the iframe element */
    iframeRef: React.RefObject<HTMLIFrameElement | null>;
};
declare function usePreviewSender(config: UsePreviewSenderConfig): UsePreviewSenderResult;

type UseWebsiteGlobalDataConfig = {
    /** The global's CMS page path, e.g. 'footer' or 'navigation'. */
    path: string;
    /** Server-fetched published data, passed from the site layout. */
    initialData?: Record<string, unknown> | null;
};
declare function useWebsiteGlobalData(config: UseWebsiteGlobalDataConfig): UseWebsitePageDataResult;

type UseWebsitePageDataConfig = {
    path: string;
    /** Server-fetched published data; the SSR source outside preview. */
    initialData?: Record<string, unknown> | null;
    /** Client fetcher, used only when `initialData` is absent. */
    fetchData?: () => Promise<Record<string, unknown>>;
};
declare function useWebsitePageData(config: UseWebsitePageDataConfig): UseWebsitePageDataResult;

export { type BlockTypeInput as B, type CallApi as C, type DimensionOption as D, type ListField as L, type PreviewDevice as P, type SimpleField as S, type Translations as T, type UnsavedChangesGuard as U, type VariantEditorConfig as V, type BlockType as a, type Block as b, type BlockFieldRenderers as c, type BlockFieldPreviews as d, type BlockErrors as e, type BlockComponentProps as f, type DimensionChip as g, type VariantBase as h, type VariantDetailBase as i, type Dimension as j, type VariantEditorState as k, type BlockTypeField as l, type BlockFieldPreview as m, type BlockFieldRenderer as n, type BlockFieldRendererProps as o, type ListItem as p, PREVIEW_MESSAGE as q, type PreviewMessage as r, type SimpleFieldKind as s, type UseWebsitePageDataResult as t, usePreviewReceiver as u, usePreviewSender as v, useWebsiteGlobalData as w, useWebsitePageData as x };
