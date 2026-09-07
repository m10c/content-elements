'use client';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { FieldText } from '@m10c/mui-kit';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import type {
  Block,
  BlockFieldPreviews,
  BlockFieldRenderer,
  BlockFieldRenderers,
  BlockType,
  BlockTypeField,
  BlockTypeInput,
  ListField,
  SimpleField,
} from '../types';

/** Icons a consumer can swap for its own icon set. */
export type ListCardIcons = {
  drag?: React.ReactNode;
  edit?: React.ReactNode;
};

type Props = {
  blockTypes: readonly BlockTypeInput[];
  field: FieldProp<Block[]>;
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
};

export default function BlocksField({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
}: Props) {
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
          previews={previews}
          icons={icons}
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
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  onChange: (next: Block) => void;
};

function BlockCard({
  block,
  blockType,
  renderers,
  previews,
  icons,
  onChange,
}: BlockCardProps) {
  function updateData(key: string, value: unknown) {
    onChange({ ...block, data: { ...block.data, [key]: value } });
  }

  const fields = blockType?.fields ?? {};
  const headerFieldKeys = new Set(
    Object.values(fields).flatMap((fieldDef) =>
      fieldDef.kind === 'list' ? (fieldDef.headerFieldKeys ?? []) : [],
    ),
  );

  /** The fields a list field claims for its heading, rendered in schema order. */
  function renderHeaderFields(fieldDef: BlockTypeField) {
    if (fieldDef.kind !== 'list' || !fieldDef.headerFieldKeys?.length) {
      return undefined;
    }
    const claimed = fieldDef.headerFieldKeys;
    return (
      <>
        {Object.entries(fields)
          .filter(([key]) => claimed.includes(key))
          .map(([key, headerFieldDef]) =>
            headerFieldDef.kind === 'list' ? null : (
              <SimpleFieldRenderer
                key={key}
                fieldKey={key}
                fieldDef={headerFieldDef}
                value={block.data[key]}
                renderers={renderers}
                onChange={(value) => updateData(key, value)}
              />
            ),
          )}
      </>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={2}>
          {!blockType?.hideLabel && (
            <Typography variant="subtitle1">
              {blockType?.label ?? `Unknown block: ${block.type}`}
            </Typography>
          )}
          {blockType ? (
            Object.entries(blockType.fields)
              .filter(([key]) => !headerFieldKeys.has(key))
              .map(([key, fieldDef]) => (
                <BlockFieldRenderer
                  key={key}
                  fieldKey={key}
                  fieldDef={fieldDef}
                  value={block.data[key]}
                  renderers={renderers}
                  previews={previews}
                  icons={icons}
                  headerSlot={renderHeaderFields(fieldDef)}
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
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  headerSlot?: React.ReactNode;
  onChange: (value: unknown) => void;
};

function BlockFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  previews,
  icons,
  headerSlot,
  onChange,
}: BlockFieldRendererProps) {
  if (fieldDef.kind === 'list') {
    return (
      <ListFieldRenderer
        fieldDef={fieldDef}
        value={Array.isArray(value) ? value : []}
        renderers={renderers}
        previews={previews}
        icons={icons}
        headerSlot={headerSlot}
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
  const label = labelOverride ?? fieldLabel(fieldDef, fieldKey);

  const customRenderer: BlockFieldRenderer | undefined =
    renderers?.[fieldDef.kind];
  if (customRenderer) {
    return (
      <>
        {customRenderer({
          name: fieldKey,
          label,
          value: stringValue,
          features: fieldDef.features,
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

/** A field's label, marked with an asterisk when it is required. */
function fieldLabel(fieldDef: BlockTypeField, fallback: string) {
  return `${fieldDef.label ?? fallback}${fieldDef.required ? '*' : ''}`;
}

type ListItem = Record<string, unknown>;

type ListFieldRendererProps = {
  fieldDef: ListField;
  value: ListItem[];
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  headerSlot?: React.ReactNode;
  onChange: (value: ListItem[]) => void;
};

function ListFieldRenderer(props: ListFieldRendererProps) {
  return props.fieldDef.variant === 'cards' ? (
    <ListCards {...props} />
  ) : (
    <ListInline {...props} />
  );
}

/**
 * Lists every item's fields one after another, separated by a divider. The
 * number of items comes from the data, so there is nothing to add or delete.
 */
function ListInline({
  fieldDef,
  value: items,
  renderers,
  onChange,
}: ListFieldRendererProps) {
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
              labelOverride={`${fieldLabel(subFieldDef, subKey)} ${itemLabel} ${index + 1}`}
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

/**
 * Shows each item as a summary card that opens a dialog to edit. Items can be
 * added until `maxItems` is reached, and deleted while more than `minItems`
 * remain.
 */
function ListCards({
  fieldDef,
  value: items,
  renderers,
  previews,
  icons,
  headerSlot,
  onChange,
}: ListFieldRendererProps) {
  const [editedIndex, setEditedIndex] = React.useState<number | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const itemLabel = fieldDef.itemLabel ?? 'item';
  const editedItem = editedIndex === null ? undefined : items[editedIndex];
  const { maxItems, minItems } = fieldDef;
  const isFull = maxItems !== undefined && items.length >= maxItems;
  const canDelete = items.length > (minItems ?? 0);
  // A list whose length is fixed has nothing to add or count.
  const isFixedLength = minItems !== undefined && minItems === maxItems;

  function replaceItem(index: number, next: ListItem) {
    const updated = items.slice();
    updated[index] = next;
    onChange(updated);
  }

  function deleteItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(from: number, to: number) {
    const updated = items.slice();
    const [moved] = updated.splice(from, 1);
    if (moved === undefined) return;
    updated.splice(to, 0, moved);
    onChange(updated);
  }

  return (
    <Stack spacing={1.5}>
      {!isFixedLength && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1">
            {fieldLabel(fieldDef, itemLabel)}
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            disabled={isFull}
            onClick={() => setIsAdding(true)}
          >
            Add
          </Button>
        </Stack>
      )}

      {maxItems !== undefined && !isFixedLength && (
        <Typography variant="body2" color="text.secondary">
          {items.length} of {maxItems} {itemLabel}(s) added. You can add up to{' '}
          {maxItems} {itemLabel}s.
        </Typography>
      )}

      {headerSlot}

      {items.map((item, index) => (
        <ListItemCard
          key={index}
          fieldDef={fieldDef}
          item={item}
          previews={previews}
          icons={icons}
          onEdit={() => setEditedIndex(index)}
          onDragStart={() => setDraggedIndex(index)}
          onDragEnd={() => setDraggedIndex(null)}
          onDrop={() => {
            if (draggedIndex !== null && draggedIndex !== index) {
              moveItem(draggedIndex, index);
            }
            setDraggedIndex(null);
          }}
        />
      ))}

      {editedIndex !== null && editedItem !== undefined && (
        <ListItemDialog
          title={`Edit ${fieldDef.label ?? itemLabel}`}
          fieldDef={fieldDef}
          item={editedItem}
          renderers={renderers}
          confirmLabel="Save"
          onDelete={
            canDelete
              ? () => {
                  deleteItem(editedIndex);
                  setEditedIndex(null);
                }
              : undefined
          }
          onConfirm={(next) => {
            replaceItem(editedIndex, next);
            setEditedIndex(null);
          }}
          onClose={() => setEditedIndex(null)}
        />
      )}

      {isAdding && (
        <ListItemDialog
          title={`Add ${fieldDef.label ?? itemLabel}`}
          fieldDef={fieldDef}
          item={{}}
          renderers={renderers}
          confirmLabel="Create"
          onConfirm={(next) => {
            onChange([...items, next]);
            setIsAdding(false);
          }}
          onClose={() => setIsAdding(false)}
        />
      )}
    </Stack>
  );
}

type ListItemCardProps = {
  fieldDef: ListField;
  item: ListItem;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  onEdit: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
};

function ListItemCard({
  fieldDef,
  item,
  previews,
  icons,
  onEdit,
  onDragStart,
  onDragEnd,
  onDrop,
}: ListItemCardProps) {
  // Only the handle starts a drag, so text inside the card stays selectable.
  const [isDraggable, setIsDraggable] = React.useState(false);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={() => {
        setIsDraggable(false);
        onDragEnd();
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      sx={{ p: 2, borderRadius: 1, bgcolor: 'grey.100' }}
    >
      <Box
        onMouseDown={() => setIsDraggable(true)}
        onMouseUp={() => setIsDraggable(false)}
        sx={{ display: 'flex', color: 'primary.main', cursor: 'grab' }}
      >
        {icons?.drag ?? <DragIndicatorIcon fontSize="small" />}
      </Box>
      <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
        {Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => {
          const value = typeof item[subKey] === 'string' ? item[subKey] : null;
          const preview = previews?.[subFieldDef.kind];
          return (
            <Stack key={subKey} spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {fieldLabel(subFieldDef, subKey)}
              </Typography>
              {preview ? (
                preview(value)
              ) : (
                <Typography variant="body1">{value}</Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
      <IconButton
        size="small"
        onClick={onEdit}
        aria-label="Edit item"
        sx={{ color: 'primary.main' }}
      >
        {icons?.edit ?? <EditOutlinedIcon fontSize="small" />}
      </IconButton>
    </Stack>
  );
}

type ListItemDialogProps = {
  title: string;
  fieldDef: ListField;
  item: ListItem;
  renderers?: BlockFieldRenderers;
  confirmLabel: string;
  onDelete?: () => void;
  onConfirm: (item: ListItem) => void;
  onClose: () => void;
};

function ListItemDialog({
  title,
  fieldDef,
  item,
  renderers,
  confirmLabel,
  onDelete,
  onConfirm,
  onClose,
}: ListItemDialogProps) {
  const [draft, setDraft] = React.useState(item);

  return (
    <Dialog open fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {!!fieldDef.variables?.length && (
            <Stack
              spacing={1}
              sx={{ p: 2, borderRadius: 1, bgcolor: 'grey.100' }}
            >
              <Typography variant="subtitle2">Variables to use</Typography>
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider flexItem orientation="vertical" />}
              >
                {fieldDef.variables.map((variable) => (
                  <Stack key={variable.token} spacing={0.5} sx={{ flex: 1 }}>
                    <Typography variant="body2">{variable.token}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {variable.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
          {Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => (
            <SimpleFieldRenderer
              key={subKey}
              fieldKey={subKey}
              fieldDef={subFieldDef}
              value={draft[subKey]}
              renderers={renderers}
              onChange={(subValue) =>
                setDraft({ ...draft, [subKey]: subValue })
              }
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {onDelete ? (
          <>
            <Button variant="outlined" color="error" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="contained" onClick={() => onConfirm(draft)}>
              {confirmLabel}
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onConfirm(draft)}
          >
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
