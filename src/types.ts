export type SimpleFieldKind =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'markdown'
  | 'icon'
  | 'image'
  | 'images'
  | 'select'
  | 'boolean'
  | 'note';

export type SimpleField = {
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

export type ListField = {
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
  variables?: { token: string; description: string }[];
  itemFields: Record<string, SimpleField>;
};

export type BlockTypeField = SimpleField | ListField;

export type BlockType = {
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
export type BlockTypeInput = {
  key: string;
  label: string;
  fields: unknown;
};

export type Block = {
  type: string;
  data: Record<string, unknown>;
};

export type BlockFieldRendererProps = {
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

export type BlockFieldRenderer = (
  props: BlockFieldRendererProps,
) => React.ReactNode;

export type BlockFieldRenderers = Partial<
  Record<SimpleFieldKind | string, BlockFieldRenderer>
>;

/**
 * Validation messages keyed by field path: `<block>.<field>` for a simple
 * field, `<block>.<field>.<item>.<subField>` inside a list.
 */
export type BlockErrors = Record<string, string>;

/**
 * Draws a field's saved value inside a card summary, e.g. the icon a slug
 * names. Without one the value is shown as text.
 */
export type BlockFieldPreview = (value: string | null) => React.ReactNode;

export type BlockFieldPreviews = Partial<
  Record<SimpleFieldKind | string, BlockFieldPreview>
>;
