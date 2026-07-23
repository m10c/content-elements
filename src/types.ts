export type SimpleFieldKind =
  'text' | 'textarea' | 'richtext' | 'markdown' | 'image';

export type SimpleField = {
  kind: SimpleFieldKind;
  label?: string;
  maxLength?: number;
  /** Markdown feature flags, e.g. ['bold', 'italic', 'lists', 'links'] */
  features?: string[];
};

export type ListField = {
  kind: 'list';
  label?: string;
  itemLabel?: string;
  minItems?: number;
  maxItems?: number;
  itemFields: Record<string, SimpleField>;
};

export type BlockTypeField = SimpleField | ListField;

export type BlockType = {
  key: string;
  label: string;
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
  onChange: (value: string | null) => void;
};

export type BlockFieldRenderer = (
  props: BlockFieldRendererProps,
) => React.ReactNode;

export type BlockFieldRenderers = Partial<
  Record<SimpleFieldKind | string, BlockFieldRenderer>
>;
