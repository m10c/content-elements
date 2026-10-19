import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1 from 'react';
import { CardProps } from '@mui/material';
import { FieldProp, FormObject, useForm } from 'react-typed-form';
export { usePreviewSender, useWebsiteGlobalData, useWebsitePageData } from './hooks.js';

declare const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, number>;

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
    defaultValue?: string;
    translatable?: boolean;
};
type Translations = Record<string, unknown>;
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
type DragRowProps = {
    onDragStart: (event: React.DragEvent) => void;
    onDragEnd: () => void;
    onDragOver: (event: React.DragEvent) => void;
    onDrop: () => void;
};
type BlockComponentProps = {
    block: Block;
    onChange: (data: Record<string, unknown>) => void;
    errors?: BlockErrors;
    errorPath: string;
    headerActionContainer: HTMLElement | null;
};

type Props$e = {
    open: boolean;
    onClose: () => void;
    blockTypes: readonly BlockTypeInput[];
    onSelect: (blockType: BlockType) => void;
    icons?: Record<string, React$1.ReactNode>;
    title?: string;
};
declare function AddBlockDialog({ open, onClose, blockTypes, onSelect, icons, title, }: Props$e): react_jsx_runtime.JSX.Element;

type Props$d = Omit<CardProps, 'title'> & {
    gutter?: React$1.ReactNode;
    title?: React$1.ReactNode;
    action?: React$1.ReactNode;
    children?: React$1.ReactNode;
};
declare function BlockCardFrame({ gutter, title, action, children, sx, ...cardProps }: Props$d): react_jsx_runtime.JSX.Element;

/** Icons a consumer can swap for its own icon set. */
type ListCardIcons = {
    drag?: React$1.ReactNode;
    edit?: React$1.ReactNode;
    delete?: React$1.ReactNode;
};
type Props$c = {
    blockTypes: readonly BlockTypeInput[];
    field: FieldProp<Block[]>;
    renderers?: BlockFieldRenderers;
    previews?: BlockFieldPreviews;
    icons?: ListCardIcons;
    errors?: BlockErrors;
    /** Must be stable components - a new component type remounts its blocks and loses input focus */
    blockComponents?: Record<string, React$1.ComponentType<BlockComponentProps>>;
    canEditBlockList?: boolean;
    header?: React$1.ReactNode;
    footer?: React$1.ReactNode;
    emptyState?: React$1.ReactNode;
};
type BlocksFieldHandle = {
    /**
     * Scrolls the block at `index` into view. Safe to call straight after adding
     * a block: the scroll waits until that block has rendered.
     */
    scrollToBlock: (index: number) => void;
};
declare const _default: React$1.ForwardRefExoticComponent<Props$c & React$1.RefAttributes<BlocksFieldHandle>>;

type Props$b = {
    open: boolean;
    title: string;
    description: React$1.ReactNode;
    subtitle?: React$1.ReactNode;
    warning?: React$1.ReactNode;
    confirmText?: string;
    confirmColor?: 'error' | 'primary' | 'warning' | 'success';
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};
declare function ConfirmDialog({ open, title, description, subtitle, warning, confirmText, confirmColor, isLoading, onClose, onConfirm, }: Props$b): react_jsx_runtime.JSX.Element;

type Props$a = {
    value: string;
    options: readonly DimensionOption[];
    onChange: (value: string) => void;
    getChips?: (value: string) => DimensionChip[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
};
declare function DimensionSelect({ value, options, onChange, getChips, label, placeholder, disabled, }: Props$a): react_jsx_runtime.JSX.Element;

type Props$9 = {
    previewUrl: string;
    src: string;
    content: Record<string, unknown>;
    renderWidth: number;
    pagePath?: string;
    globals?: Record<string, unknown>;
    title?: string;
};
declare function LivePreview({ previewUrl, src, content, renderWidth, pagePath, globals, title, }: Props$9): react_jsx_runtime.JSX.Element;

type Props$8 = {
    blockTypes: readonly BlockTypeInput[];
    field: FieldProp<Block[]>;
    renderers?: BlockFieldRenderers;
    previews?: BlockFieldPreviews;
    icons?: ListCardIcons;
    errors?: BlockErrors;
    /** Names for the preview's device sizes, e.g. 'Mobile website'. */
    deviceLabels?: Partial<Record<PreviewDevice, string>>;
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
declare function PageEditor({ blockTypes, field, renderers, previews, icons, errors, deviceLabels, previewUrl, pagePath, previewPath, previewContent, globalPagePaths, isSaving, publishDisabled, onPublish, }: Props$8): react_jsx_runtime.JSX.Element;

type Props$7 = {
    value: PreviewDevice;
    onChange: (device: PreviewDevice) => void;
    labels?: Partial<Record<PreviewDevice, string>>;
};
declare function PreviewDeviceSelect({ value, onChange, labels, }: Props$7): react_jsx_runtime.JSX.Element;

type Props$6 = {
    iframeRef: React$1.RefObject<HTMLIFrameElement | null>;
    src: string;
    renderWidth: number;
    title?: string;
};
declare function PreviewIframe({ iframeRef, src, renderWidth, title, }: Props$6): react_jsx_runtime.JSX.Element | null;

type Props$5 = {
    children: React$1.ReactNode;
    preview: React$1.ReactNode;
    previewToolbar?: React$1.ReactNode;
    previewWidth?: number;
};
declare function PreviewLayout({ children, preview, previewToolbar, previewWidth, }: Props$5): react_jsx_runtime.JSX.Element;

type Props$4 = {
    isPreviewVisible: boolean;
    onClick: () => void;
};
declare function PreviewToggleButton({ isPreviewVisible, onClick, }: Props$4): react_jsx_runtime.JSX.Element;

type Props$3<T extends {
    publishAt: string | null;
}> = {
    item: T;
};
declare function PublishState<T extends {
    publishAt: string | null;
}>({ item, }: Props$3<T>): react_jsx_runtime.JSX.Element;

type Props$2 = {
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
declare function SeoEditor({ pageTitleField, descriptionField, renderers, imageField, renderImageField, imagePreviewUrl, fallbackImageUrl, faviconUrl, fallbackTitle, siteName, isSaving, publishDisabled, onPublish, }: Props$2): react_jsx_runtime.JSX.Element;

type Props$1 = {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    onContinueWithoutSaving: () => void;
};
declare function UnsavedChangesDialog({ open, onClose, onSave, onContinueWithoutSaving, }: Props$1): react_jsx_runtime.JSX.Element;

type Props = VariantEditorConfig & {
    children: React$1.ReactNode;
};
declare function VariantEditorProvider({ children, getParams, defaultDimension, ...actions }: Props): react_jsx_runtime.JSX.Element;
declare function useVariantEditorContext(): VariantEditorConfig;

type Options$2<V extends VariantBase> = {
    dimension: Dimension;
    variants: readonly V[];
    value: string;
    onValueChange: (value: string) => void;
    publishable?: boolean;
};
type DimensionSwitcher<V extends VariantBase, D extends VariantDetailBase> = {
    dimension: Dimension;
    value: string;
    isDefault: boolean;
    currentVariant: V | null;
    sourceVariant: V | null;
    currentDetail: D | null;
    isLoadingDetail: boolean;
    hasDetailError: boolean;
    reloadDetail: () => void;
    setValue: (value: string) => void;
    getLabel: (value: string) => string;
    getChips: (value: string) => DimensionChip[];
};
declare function useDimensionSwitcher<V extends VariantBase, D extends VariantDetailBase>({ dimension, variants, value, onValueChange, publishable, }: Options$2<V>): DimensionSwitcher<V, D>;

declare function useDragReorder(onMove: (from: number, to: number) => void): (index: number) => DragRowProps;

declare function useDraggableByHandle(): {
    isDraggable: boolean;
    stopDragging: () => void;
    handleProps: {
        onMouseDown: () => void;
        onMouseUp: () => void;
    };
};

type Options$1 = {
    hasUnsavedChanges: boolean;
    onSave: () => Promise<boolean>;
};
type UnsavedChangesGuard = {
    guard: (action: () => void) => void;
    guardNavigate: (navigate: () => void) => Promise<boolean>;
    hasUnsavedChanges: boolean;
    hasPending: boolean;
    handlePending: (save: boolean) => Promise<void>;
    dismissPending: () => void;
};
declare function useUnsavedChangesGuard({ hasUnsavedChanges, onSave, }: Options$1): UnsavedChangesGuard;

type SubmitHelpers = {
    addSubmitError: (field: string, error: string) => void;
    setLoading: (loading: boolean) => void;
};
type Options<V extends VariantBase> = {
    identityIri: string;
    variantsPath: string;
    entityLabel: string;
    listPath: string;
    dimension: Dimension;
    variants: readonly V[];
    value: string;
    currentVariant: V | null;
};
type VariantActionHandlers = {
    translate: (fields: string[], source: VariantBase) => Promise<Translations | null>;
    submit: (values: Record<string, unknown>, helpers: SubmitHelpers) => Promise<boolean>;
    publish: (publishAt: string) => Promise<boolean>;
    unpublish: () => Promise<boolean>;
    remove: () => Promise<boolean>;
    invalidate: () => void;
};
declare function useVariantActions<V extends VariantBase>({ identityIri, variantsPath, entityLabel, listPath, dimension, variants, value, currentVariant, }: Options<V>): VariantActionHandlers;

type UseVariantEditorOptions<V extends VariantBase, D extends VariantDetailBase, T extends Record<string, unknown>> = {
    identityIri: string;
    variantsPath: string;
    entityLabel: string;
    listPath: string;
    variants: readonly V[];
    toFormValues: (detail: D | null) => T;
    dimension?: Dimension;
    publishable?: boolean;
    postValidateTransform?: (values: Partial<T>) => Record<string, unknown>;
};
type VariantEditorState<V extends VariantBase, D extends VariantDetailBase, T extends Record<string, unknown>> = {
    entityLabel: string;
    dimension: Dimension;
    variants: readonly V[];
    publishable: boolean;
    switcher: DimensionSwitcher<V, D>;
    form: FormObject<Partial<T>>;
    guard: UnsavedChangesGuard;
    actions: VariantActionHandlers;
    canTranslate: boolean;
    isPublished: boolean;
    isNewVariant: boolean;
    isLastVariant: boolean;
    switchTo: (value: string) => void;
    save: () => Promise<boolean>;
    remove: () => Promise<boolean>;
};
declare function useVariantEditor<V extends VariantBase, D extends VariantDetailBase, T extends Record<string, unknown>>({ identityIri, variantsPath, entityLabel, listPath, variants, toFormValues, dimension: dimensionOverride, publishable, postValidateTransform, }: UseVariantEditorOptions<V, D, T>): VariantEditorState<V, D, T>;

type FormObjectSubmit<T extends Record<string, unknown>> = Parameters<typeof useForm<T>>[0] extends {
    onSubmit: infer S;
} ? S : never;
type UseVariantFormOptions<T extends Record<string, unknown>> = {
    savedValues: T;
    resetKey: string;
    onSubmit: FormObjectSubmit<Partial<T>>;
};
declare function useVariantForm<T extends Record<string, unknown>>({ savedValues, resetKey, onSubmit, }: UseVariantFormOptions<T>): FormObject<Partial<T>>;

declare function createBlock(blockType: BlockType): Block;

declare function dimensionValue(variant: VariantBase, key: string): string;

declare function emptyFieldValue(fieldDef: BlockTypeField): false | "" | never[];

declare function moveItem<T>(items: readonly T[], from: number, to: number): T[];

declare function publishStatusChip(publishAt: string | null | undefined): DimensionChip;

export { AddBlockDialog, type Block, BlockCardFrame, type BlockComponentProps, type BlockErrors, type BlockFieldPreview, type BlockFieldPreviews, type BlockFieldRenderer, type BlockFieldRendererProps, type BlockFieldRenderers, type BlockType, type BlockTypeField, type BlockTypeInput, _default as BlocksField, type BlocksFieldHandle, type CallApi, ConfirmDialog, type Dimension, type DimensionChip, type DimensionOption, DimensionSelect, type DragRowProps, type ListCardIcons, type ListField, LivePreview, PREVIEW_DEVICE_WIDTHS, PREVIEW_MESSAGE, PageEditor, type PreviewDevice, PreviewDeviceSelect, PreviewIframe, PreviewLayout, type PreviewMessage, PreviewToggleButton, PublishState, SeoEditor, type SimpleField, type SimpleFieldKind, type Translations, UnsavedChangesDialog, type VariantBase, type VariantDetailBase, type VariantEditorConfig, VariantEditorProvider, createBlock, dimensionValue, emptyFieldValue, moveItem, publishStatusChip, useDimensionSwitcher, useDragReorder, useDraggableByHandle, useUnsavedChangesGuard, useVariantActions, useVariantEditor, useVariantEditorContext, useVariantForm };
