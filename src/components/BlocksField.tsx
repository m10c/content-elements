'use client';

import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { FieldText } from '@m10c/mui-kit';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import type {
  Block,
  BlockFieldRenderer,
  BlockFieldRenderers,
  BlockType,
  BlockTypeField,
  BlockTypeInput,
  ListField,
  SimpleField,
} from '../types';

type Props = {
  blockTypes: readonly BlockTypeInput[];
  field: FieldProp<Block[]>;
  renderers?: BlockFieldRenderers;
};

export default function BlocksField({ blockTypes, field, renderers }: Props) {
  const blocks = field.value ?? [];
  // The boundary types `fields` as `unknown` (see BlockTypeInput); the BE sends
  // the rich field metadata, so narrow to BlockType here, the single point of
  // truth for the shape the renderers below depend on.
  const blockTypesByKey = React.useMemo(
    () =>
      Object.fromEntries(
        blockTypes.map((blockType) => [blockType.key, blockType]),
      ) as Record<string, BlockType>,
    [blockTypes],
  );

  function updateBlock(index: number, next: Block) {
    const updated = blocks.slice();
    updated[index] = next;
    field.handleValueChange(updated);
  }

  return (
    <Stack spacing={2}>
      {blocks.map((block, index) => (
        <BlockCard
          key={index}
          block={block}
          blockType={blockTypesByKey[block.type]}
          renderers={renderers}
          onChange={(next) => updateBlock(index, next)}
        />
      ))}
    </Stack>
  );
}

type BlockCardProps = {
  block: Block;
  blockType: BlockType | undefined;
  renderers?: BlockFieldRenderers;
  onChange: (next: Block) => void;
};

function BlockCard({ block, blockType, renderers, onChange }: BlockCardProps) {
  function updateData(key: string, value: unknown) {
    onChange({ ...block, data: { ...block.data, [key]: value } });
  }

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1">
            {blockType?.label ?? `Unknown block: ${block.type}`}
          </Typography>
          {blockType ? (
            Object.entries(blockType.fields).map(([key, fieldDef]) => (
              <BlockFieldRenderer
                key={key}
                fieldKey={key}
                fieldDef={fieldDef}
                value={block.data[key]}
                renderers={renderers}
                onChange={(value) => updateData(key, value)}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No schema registered for block type &quot;{block.type}&quot;.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

type BlockFieldRendererProps = {
  fieldKey: string;
  fieldDef: BlockTypeField;
  value: unknown;
  renderers?: BlockFieldRenderers;
  onChange: (value: unknown) => void;
};

function BlockFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  onChange,
}: BlockFieldRendererProps) {
  if (fieldDef.kind === 'list') {
    return (
      <ListFieldRenderer
        fieldDef={fieldDef}
        value={Array.isArray(value) ? value : []}
        renderers={renderers}
        onChange={onChange}
      />
    );
  }
  return (
    <SimpleFieldRenderer
      fieldKey={fieldKey}
      fieldDef={fieldDef}
      value={value}
      renderers={renderers}
      onChange={onChange}
    />
  );
}

type SimpleFieldRendererProps = {
  fieldKey: string;
  fieldDef: SimpleField;
  value: unknown;
  renderers?: BlockFieldRenderers;
  /** Overrides the rendered label (used to suffix a list item's index). */
  labelOverride?: string;
  onChange: (value: string | null) => void;
};

function SimpleFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  labelOverride,
  onChange,
}: SimpleFieldRendererProps) {
  const stringValue = typeof value === 'string' ? value : null;
  const label = labelOverride ?? fieldDef.label ?? fieldKey;

  const customRenderer: BlockFieldRenderer | undefined =
    renderers?.[fieldDef.kind];
  if (customRenderer) {
    return (
      <>
        {customRenderer({
          name: fieldKey,
          label,
          value: stringValue,
          onChange,
        })}
      </>
    );
  }

  const fieldProp: FieldProp<string | null> = {
    name: fieldKey,
    label,
    value: stringValue,
    handleValueChange: onChange,
  };

  const multiline =
    fieldDef.kind === 'textarea' ||
    fieldDef.kind === 'markdown' ||
    fieldDef.kind === 'richtext';

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{label}</Typography>
      <FieldText
        field={fieldProp}
        hiddenLabel
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        inputProps={
          fieldDef.maxLength ? { maxLength: fieldDef.maxLength } : undefined
        }
      />
    </Stack>
  );
}

type ListItem = Record<string, unknown>;

type ListFieldRendererProps = {
  fieldDef: ListField;
  value: ListItem[];
  renderers?: BlockFieldRenderers;
  onChange: (value: ListItem[]) => void;
};

/**
 * Renders a fixed list of items inline (count comes from the BE data, no
 * add/remove). Each item's fields are shown with an index-suffixed label and
 * separated by a divider.
 */
function ListFieldRenderer({
  fieldDef,
  value,
  renderers,
  onChange,
}: ListFieldRendererProps) {
  const items = value;
  const itemLabel = fieldDef.itemLabel ?? fieldDef.label ?? 'Item';

  function updateItem(index: number, next: ListItem) {
    const updated = items.slice();
    updated[index] = next;
    onChange(updated);
  }

  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Divider />}
          {Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => (
            <SimpleFieldRenderer
              key={subKey}
              fieldKey={subKey}
              fieldDef={subFieldDef}
              value={item[subKey]}
              renderers={renderers}
              labelOverride={`${subFieldDef.label ?? subKey} ${itemLabel} ${index + 1}`}
              onChange={(subValue) =>
                updateItem(index, { ...item, [subKey]: subValue })
              }
            />
          ))}
        </React.Fragment>
      ))}
    </Stack>
  );
}
