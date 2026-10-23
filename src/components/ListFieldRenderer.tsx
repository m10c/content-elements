import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, Stack, Typography } from '@mui/material';
import React from 'react';

import useKeyedList from '../hooks/use-keyed-list';
import type {
  BlockErrors,
  BlockFieldPreviews,
  BlockFieldRenderers,
  ListField,
  ListItem,
} from '../types';
import emptyFieldValue from '../utils/empty-field-value';
import fieldLabel from '../utils/field-label';
import type { ListCardIcons } from './BlocksField';
import ListItemCard from './ListItemCard';
import ListItemDialog from './ListItemDialog';
import SimpleFieldRenderer from './SimpleFieldRenderer';
import SortableList from './SortableList';

/** A new item starts with every field set, so none is sent to the API missing. */
function emptyItem(fieldDef: ListField): ListItem {
  return Object.fromEntries(
    Object.entries(fieldDef.itemFields).map(([key, subFieldDef]) => [
      key,
      emptyFieldValue(subFieldDef),
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

export default function ListFieldRenderer(props: ListFieldRendererProps) {
  return props.fieldDef.variant === 'inline' ? (
    <ListInline {...props} />
  ) : (
    <ListCards {...props} />
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
  const { keys, replace } = useKeyedList(items, onChange);

  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <React.Fragment key={keys[index]}>
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
                replace(index, { ...item, [subKey]: subValue })
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

  const { keys, replace, remove, move } = useKeyedList(items, onChange);

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

      <SortableList ids={keys} onMove={move}>
        {items.map((item, index) => {
          const key = keys[index];
          if (key === undefined) {
            throw new Error(`List item ${index} has no key`);
          }
          return (
            <ListItemCard
              key={key}
              sortableId={key}
              fieldDef={fieldDef}
              item={item}
              previews={previews}
              icons={icons}
              errors={itemErrors(index)}
              onEdit={() => setEditedIndex(index)}
            />
          );
        })}
      </SortableList>

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
                  remove(editedIndex);
                  setEditedIndex(null);
                }
              : undefined
          }
          onConfirm={(next) => {
            replace(editedIndex, next);
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
