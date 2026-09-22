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
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { FieldRadioGroup, FieldSwitch, FieldText } from '@m10c/mui-kit';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import type {
  Block,
  BlockErrors,
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
  errors?: BlockErrors;
};

export default function BlocksField({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors,
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
          errors={errors}
          errorPath={String(index)}
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
  errors?: BlockErrors;
  errorPath: string;
  onChange: (next: Block) => void;
};

function BlockCard({
  block,
  blockType,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
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
                error={errors?.[`${errorPath}.${key}`]}
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
                  errors={errors}
                  errorPath={`${errorPath}.${key}`}
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
  errors?: BlockErrors;
  errorPath: string;
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
  errors,
  errorPath,
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
        errors={errors}
        errorPath={errorPath}
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
      error={errors?.[errorPath]}
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
  error?: string;
  onChange: (value: unknown) => void;
};

function SimpleFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  labelOverride,
  error,
  onChange,
}: SimpleFieldRendererProps) {
  const label = labelOverride ?? fieldLabel(fieldDef, fieldKey);

  if (fieldDef.kind === 'note') {
    return <FieldNote fieldDef={fieldDef} label={label} />;
  }

  const stringValue = typeof value === 'string' ? value : null;
  const isOn = value === true;

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
          hint: fieldDef.hint,
          prefix: fieldDef.prefix,
          error,
          values: stringValues(value),
          maxItems: fieldDef.maxItems,
          checked: isOn,
          onChange,
          onChangeValues: onChange,
          onChangeChecked: onChange,
        })}
      </>
    );
  }

  if (fieldDef.kind === 'toggle') {
    return (
      <FieldWrap fieldDef={fieldDef} error={error}>
        <FieldSwitch
          field={{
            name: fieldKey,
            label,
            value: isOn,
            handleValueChange: onChange,
          }}
        />
      </FieldWrap>
    );
  }

  if (fieldDef.kind === 'choice') {
    return (
      <FieldWrap fieldDef={fieldDef} label={label} error={error}>
        <FieldRadioGroup
          field={{
            name: fieldKey,
            label,
            value: stringValue ?? '',
            handleValueChange: onChange,
          }}
          options={fieldDef.options ?? []}
        />
      </FieldWrap>
    );
  }

  // Uploading belongs to the consuming app, so an images field draws nothing
  // of its own until a renderer is given for it.
  if (fieldDef.kind === 'images') {
    return <FieldWrap fieldDef={fieldDef} label={label} error={error} />;
  }

  const fieldProp: FieldProp<string | null> = {
    name: fieldKey,
    label,
    value: stringValue,
    handleValueChange: onChange,
    errorList: error === undefined ? undefined : [error],
  };

  const multiline =
    fieldDef.kind === 'textarea' ||
    fieldDef.kind === 'markdown' ||
    fieldDef.kind === 'richtext';

  return (
    <FieldWrap fieldDef={fieldDef} label={label}>
      <FieldText
        field={fieldProp}
        hiddenLabel
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        InputProps={
          fieldDef.prefix
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    {fieldDef.prefix}
                  </InputAdornment>
                ),
              }
            : undefined
        }
        inputProps={
          fieldDef.maxLength ? { maxLength: fieldDef.maxLength } : undefined
        }
      />
    </FieldWrap>
  );
}

type FieldWrapProps = {
  fieldDef: SimpleField;
  /** Left out by a field that labels itself, e.g. a toggle. */
  label?: string;
  error?: string;
  children?: React.ReactNode;
};

/** A field's label and hint, above whatever draws its value. */
function FieldWrap({ fieldDef, label, error, children }: FieldWrapProps) {
  return (
    <Stack spacing={1}>
      <Stack spacing={0.5}>
        {label && <Typography variant="subtitle2">{label}</Typography>}
        {fieldDef.hint && (
          <Typography variant="body2" color="text.secondary">
            {fieldDef.hint}
          </Typography>
        )}
      </Stack>
      {children}
      {error && <FieldError error={error} />}
    </Stack>
  );
}

function FieldError({ error }: { error: string }) {
  return (
    <Typography variant="caption" color="error.main">
      {error}
    </Typography>
  );
}

/** Names a part of the page an admin cannot edit, e.g. a contact form. */
function FieldNote({
  fieldDef,
  label,
}: {
  fieldDef: SimpleField;
  label: string;
}) {
  return (
    <Stack spacing={0.5}>
      {fieldDef.label && <Typography variant="subtitle1">{label}</Typography>}
      <Typography variant="body2" color="text.secondary">
        {fieldDef.text}
      </Typography>
    </Stack>
  );
}

/** The strings held by a field with several values, e.g. uploaded images. */
function stringValues(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

/** A field's label, marked with an asterisk when it is required. */
function fieldLabel(fieldDef: BlockTypeField, fallback: string) {
  return `${fieldDef.label ?? fallback}${fieldDef.required ? '*' : ''}`;
}

/** What a saved value reads as in a card's summary. */
function fieldSummary(fieldDef: SimpleField, value: unknown) {
  if (fieldDef.kind === 'toggle') return value === true ? 'Yes' : 'No';
  if (typeof value !== 'string') return null;
  const option = fieldDef.options?.find((item) => item.value === value);
  if (option) return option.label;
  return fieldDef.kind === 'richtext' || fieldDef.kind === 'markdown'
    ? plainText(value)
    : value;
}

/** A card summarises its item as text, so markup is shown as the words it holds. */
function plainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

type ListItem = Record<string, unknown>;

/** A new item starts with every field set, so none is sent to the API missing. */
function emptyItem(fieldDef: ListField): ListItem {
  return Object.fromEntries(
    Object.entries(fieldDef.itemFields).map(([key, subFieldDef]) => [
      key,
      subFieldDef.kind === 'toggle' ? false : '',
    ]),
  );
}

type ListFieldRendererProps = {
  fieldDef: ListField;
  value: ListItem[];
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  errors?: BlockErrors;
  errorPath: string;
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
  errors,
  errorPath,
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
              error={errors?.[`${errorPath}.${index}.${subKey}`]}
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
  errors,
  errorPath,
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

  function itemErrors(index: number): Record<string, string> {
    const prefix = `${errorPath}.${index}.`;
    return Object.fromEntries(
      Object.entries(errors ?? {})
        .filter(([path]) => path.startsWith(prefix))
        .map(([path, message]) => [path.slice(prefix.length), message]),
    );
  }

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
          errors={itemErrors(index)}
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
          errors={itemErrors(editedIndex)}
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
          item={emptyItem(fieldDef)}
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
  errors?: Record<string, string>;
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
  errors,
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
          const label = fieldLabel(subFieldDef, subKey);
          if (subFieldDef.kind === 'note') {
            return (
              <FieldNote key={subKey} fieldDef={subFieldDef} label={label} />
            );
          }
          const value = typeof item[subKey] === 'string' ? item[subKey] : null;
          const preview = previews?.[subFieldDef.kind];
          return (
            <Stack key={subKey} spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              {preview ? (
                preview(value)
              ) : (
                <Typography variant="body1">
                  {fieldSummary(subFieldDef, item[subKey])}
                </Typography>
              )}
              {errors?.[subKey] && <FieldError error={errors[subKey]} />}
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
  errors?: Record<string, string>;
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
  errors,
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
              error={errors?.[subKey]}
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
