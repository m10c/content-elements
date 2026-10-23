import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { P as PreviewDevice, B as BlockTypeInput, a as BlockType, b as Block, c as BlockFieldRenderers, d as BlockFieldPreviews, e as BlockErrors, f as BlockComponentProps, D as DimensionOption, g as DimensionChip, V as VariantEditorConfig, h as VariantBase, i as VariantDetailBase, j as Dimension, U as UnsavedChangesGuard, T as Translations, k as VariantEditorState, l as BlockTypeField } from './website-YLVNCs6N.js';
export { m as BlockFieldPreview, n as BlockFieldRenderer, o as BlockFieldRendererProps, C as CallApi, L as ListField, p as ListItem, q as PREVIEW_MESSAGE, r as PreviewMessage, S as SimpleField, s as SimpleFieldKind, t as UseWebsitePageDataResult, u as usePreviewReceiver, v as usePreviewSender, w as useWebsiteGlobalData, x as useWebsitePageData } from './website-YLVNCs6N.js';
import { CardProps } from '@mui/material';
import { FieldProp, useForm, FormObject } from 'react-typed-form';

declare const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, number>;

type Props$f = {
    open: boolean;
    onClose: () => void;
    blockTypes: readonly BlockTypeInput[];
    onSelect: (blockType: BlockType) => void;
    icons?: Record<string, React.ReactNode>;
    title?: string;
};
declare function AddBlockDialog({ open, onClose, blockTypes, onSelect, icons, title, }: Props$f): react_jsx_runtime.JSX.Element;

type Props$e = Omit<CardProps, 'title'> & {
    gutter?: React.ReactNode;
    title?: React.ReactNode;
    action?: React.ReactNode;
    children?: React.ReactNode;
};
declare function BlockCardFrame({ gutter, title, action, children, sx, ...cardProps }: Props$e): react_jsx_runtime.JSX.Element;

/** Icons a consumer can swap for its own icon set. */
type ListCardIcons = {
    drag?: React.ReactNode;
    edit?: React.ReactNode;
    delete?: React.ReactNode;
};
type Props$d = {
    blockTypes: readonly BlockTypeInput[];
    field: FieldProp<Block[]>;
    renderers?: BlockFieldRenderers;
    previews?: BlockFieldPreviews;
    icons?: ListCardIcons;
    errors?: BlockErrors;
    /** Must be stable components - a new component type remounts its blocks and loses input focus */
    blockComponents?: Record<string, React.ComponentType<BlockComponentProps>>;
    canEditBlockList?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    emptyState?: React.ReactNode;
};
type BlocksFieldHandle = {
    /**
     * Scrolls the block at `index` into view. Safe to call straight after adding
     * a block: the scroll waits until that block has rendered.
     */
    scrollToBlock: (index: number) => void;
};
declare const _default: React.ForwardRefExoticComponent<Props$d & React.RefAttributes<BlocksFieldHandle>>;

type Props$c = {
    open: boolean;
    title: string;
    description: React.ReactNode;
    subtitle?: React.ReactNode;
    warning?: React.ReactNode;
    confirmText?: string;
    confirmColor?: 'error' | 'primary' | 'warning' | 'success';
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};
declare function ConfirmDialog({ open, title, description, subtitle, warning, confirmText, confirmColor, isLoading, onClose, onConfirm, }: Props$c): react_jsx_runtime.JSX.Element;

type Props$b = {
    value: string;
    options: readonly DimensionOption[];
    onChange: (value: string) => void;
    getChips?: (value: string) => DimensionChip[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
};
declare function DimensionSelect({ value, options, onChange, getChips, label, placeholder, disabled, }: Props$b): react_jsx_runtime.JSX.Element;

type Props$a = {
    previewUrl: string;
    src: string;
    content: Record<string, unknown>;
    renderWidth: number;
    pagePath?: string;
    globals?: Record<string, unknown>;
    title?: string;
};
declare function LivePreview({ previewUrl, src, content, renderWidth, pagePath, globals, title, }: Props$a): react_jsx_runtime.JSX.Element;

type Props$9 = {
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
declare function PageEditor({ blockTypes, field, renderers, previews, icons, errors, deviceLabels, previewUrl, pagePath, previewPath, previewContent, globalPagePaths, isSaving, publishDisabled, onPublish, }: Props$9): react_jsx_runtime.JSX.Element;

type Props$8 = {
    value: PreviewDevice;
    onChange: (device: PreviewDevice) => void;
    labels?: Partial<Record<PreviewDevice, string>>;
};
declare function PreviewDeviceSelect({ value, onChange, labels, }: Props$8): react_jsx_runtime.JSX.Element;

type Props$7 = {
    iframeRef: React.RefObject<HTMLIFrameElement | null>;
    src: string;
    renderWidth: number;
    title?: string;
};
declare function PreviewIframe({ iframeRef, src, renderWidth, title, }: Props$7): react_jsx_runtime.JSX.Element | null;

type Props$6 = {
    children: React.ReactNode;
    preview: React.ReactNode;
    previewToolbar?: React.ReactNode;
    previewWidth?: number;
};
declare function PreviewLayout({ children, preview, previewToolbar, previewWidth, }: Props$6): react_jsx_runtime.JSX.Element;

type Props$5 = {
    isPreviewVisible: boolean;
    onClick: () => void;
};
declare function PreviewToggleButton({ isPreviewVisible, onClick, }: Props$5): react_jsx_runtime.JSX.Element;

type Props$4<T extends {
    publishAt: string | null;
}> = {
    item: T;
};
declare function PublishState<T extends {
    publishAt: string | null;
}>({ item, }: Props$4<T>): react_jsx_runtime.JSX.Element;

type Props$3 = {
    pageTitleField: FieldProp<string | null>;
    descriptionField: FieldProp<string | null>;
    /** Draws the text fields, for an app whose inputs look nothing like these. */
    renderers?: BlockFieldRenderers;
    imageField?: FieldProp<string | null>;
    renderImageField?: (field: FieldProp<string | null>) => React.ReactNode;
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
declare function SeoEditor({ pageTitleField, descriptionField, renderers, imageField, renderImageField, imagePreviewUrl, fallbackImageUrl, faviconUrl, fallbackTitle, siteName, isSaving, publishDisabled, onPublish, }: Props$3): react_jsx_runtime.JSX.Element;

type Props$2 = {
    ids: string[];
    onMove: (from: number, to: number) => void;
    children: React.ReactNode;
};
declare function SortableList({ ids, onMove, children }: Props$2): react_jsx_runtime.JSX.Element;

type Props$1 = {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    onContinueWithoutSaving: () => void;
};
declare function UnsavedChangesDialog({ open, onClose, onSave, onContinueWithoutSaving, }: Props$1): react_jsx_runtime.JSX.Element;

type Props = VariantEditorConfig & {
    children: React.ReactNode;
};
declare function VariantEditorProvider({ children, ...config }: Props): react_jsx_runtime.JSX.Element;
declare function useVariantEditorContext(): VariantEditorConfig;

type Options$3<V extends VariantBase> = {
    dimension: Dimension;
    defaultValue: string | undefined;
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
declare function useDimensionSwitcher<V extends VariantBase, D extends VariantDetailBase>({ dimension, defaultValue, variants, value, onValueChange, publishable, }: Options$3<V>): DimensionSwitcher<V, D>;

declare function useKeyedList<T>(items: readonly T[], onChange: (items: T[]) => void): {
    keys: string[];
    replace: (index: number, next: T) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
};

declare function useSortableItem(id: string, disabled?: boolean): {
    itemProps: {
        ref: (node: HTMLElement | null) => void;
        style: {
            transform: string | undefined;
            transition: string | undefined;
            position: "relative";
            opacity: number | undefined;
        };
    };
    handleProps: {
        style: {
            touchAction: string;
            cursor: string;
        };
        role: string;
        tabIndex: number;
        'aria-disabled': boolean;
        'aria-pressed': boolean | undefined;
        'aria-roledescription': string;
        'aria-describedby': string;
        ref: (element: HTMLElement | null) => void;
    };
};

type Options$2 = {
    hasUnsavedChanges: boolean;
    onSave: () => Promise<boolean>;
};
declare function useUnsavedChangesGuard({ hasUnsavedChanges, onSave, }: Options$2): UnsavedChangesGuard;

type SubmitHelpers = {
    addSubmitError: (field: string, error: string) => void;
    setLoading: (loading: boolean) => void;
};
type Options$1<V extends VariantBase> = {
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
declare function useVariantActions<V extends VariantBase>({ identityIri, variantsPath, entityLabel, listPath, dimension, variants, value, currentVariant, }: Options$1<V>): VariantActionHandlers;

type Options<V extends VariantBase, D extends VariantDetailBase, T extends Record<string, unknown>> = {
    identityIri: string;
    variantsPath: string;
    entityLabel: string;
    listPath: string;
    variants: readonly V[];
    toFormValues: (detail: D | null) => T;
    dimension?: Dimension;
    defaultValue?: string;
    publishable?: boolean;
    postValidateTransform?: (values: Partial<T>) => Record<string, unknown>;
};
declare function useVariantEditor<V extends VariantBase, D extends VariantDetailBase, T extends Record<string, unknown>>({ identityIri, variantsPath, entityLabel, listPath, variants, toFormValues, dimension: dimensionOverride, defaultValue, publishable, postValidateTransform, }: Options<V, D, T>): VariantEditorState<V, D, T>;

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

export { AddBlockDialog, Block, BlockCardFrame, BlockComponentProps, BlockErrors, BlockFieldPreviews, BlockFieldRenderers, BlockType, BlockTypeField, BlockTypeInput, _default as BlocksField, type BlocksFieldHandle, ConfirmDialog, Dimension, DimensionChip, DimensionOption, DimensionSelect, type ListCardIcons, LivePreview, PREVIEW_DEVICE_WIDTHS, PageEditor, PreviewDevice, PreviewDeviceSelect, PreviewIframe, PreviewLayout, PreviewToggleButton, PublishState, SeoEditor, SortableList, Translations, UnsavedChangesDialog, UnsavedChangesGuard, VariantBase, VariantDetailBase, VariantEditorConfig, VariantEditorProvider, VariantEditorState, createBlock, dimensionValue, emptyFieldValue, moveItem, publishStatusChip, useDimensionSwitcher, useKeyedList, useSortableItem, useUnsavedChangesGuard, useVariantActions, useVariantEditor, useVariantEditorContext, useVariantForm };
