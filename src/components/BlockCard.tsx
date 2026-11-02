import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

import useSortableItem from '../hooks/use-sortable-item';
import type {
  Block,
  BlockComponentProps,
  BlockErrors,
  BlockFieldPreviews,
  BlockFieldRenderers,
  BlockType,
  BlockTypeField,
} from '../types';
import BlockCardFrame from './BlockCardFrame';
import BlockFieldRenderer from './BlockFieldRenderer';
import type { ListCardIcons } from './BlocksField';
import SimpleFieldRenderer from './SimpleFieldRenderer';

type BlockCardProps = {
  sortableId: string;
  elementRef: (element: HTMLElement | null) => void;
  block: Block;
  blockType: BlockType | undefined;
  component?: React.ComponentType<BlockComponentProps>;
  renderers?: BlockFieldRenderers;
  previews?: BlockFieldPreviews;
  icons?: ListCardIcons;
  errors?: BlockErrors;
  errorPath: string;
  canReorder: boolean;
  onChange: (next: Block) => void;
  onDelete?: () => void;
};

export default function BlockCard({
  sortableId,
  elementRef,
  block,
  blockType,
  component: BlockComponent,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  canReorder,
  onChange,
  onDelete,
}: BlockCardProps) {
  const { itemProps, handleProps } = useSortableItem(sortableId, !canReorder);
  const [headerActionContainer, setHeaderActionContainer] =
    React.useState<HTMLElement | null>(null);

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

  const showLabel = !blockType?.hideLabel;

  const label = blockType?.label ?? `Unknown block: ${block.type}`;
  const body = BlockComponent ? (
    <BlockComponent
      block={block}
      onChange={(data) => onChange({ ...block, data })}
      errors={errors}
      errorPath={errorPath}
      headerActionContainer={headerActionContainer}
    />
  ) : blockType ? (
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
  );

  const card =
    canReorder || onDelete ? (
      <BlockCardFrame
        gutter={
          canReorder && (
            <Box
              {...handleProps}
              sx={{ display: 'flex', color: 'primary.main' }}
            >
              {icons?.drag ?? <DragIndicatorIcon />}
            </Box>
          )
        }
        title={showLabel ? label : undefined}
        action={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box ref={setHeaderActionContainer} sx={{ display: 'flex' }} />
            {onDelete && (
              <IconButton
                size="small"
                onClick={onDelete}
                aria-label="Delete block"
              >
                {icons?.delete ?? <DeleteOutlineIcon />}
              </IconButton>
            )}
          </Stack>
        }
      >
        {body}
      </BlockCardFrame>
    ) : (
      <Card>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Stack spacing={2}>
            {showLabel && <Typography variant="subtitle1">{label}</Typography>}
            {body}
          </Stack>
        </CardContent>
      </Card>
    );

  return (
    <div
      ref={(element) => {
        itemProps.ref(element);
        elementRef(element);
      }}
      style={itemProps.style}
    >
      {card}
    </div>
  );
}
