'use client';

import { Stack } from '@mui/material';
import React from 'react';
import { FieldProp } from 'react-typed-form';

import useKeyedList from '../hooks/use-keyed-list';
import type {
  Block,
  BlockComponentProps,
  BlockErrors,
  BlockFieldPreviews,
  BlockFieldRenderers,
  BlockType,
  BlockTypeInput,
} from '../types';
import BlockCard from './BlockCard';
import ConfirmDialog from './ConfirmDialog';
import SortableList from './SortableList';

/** Icons a consumer can swap for its own icon set. */
export type ListCardIcons = {
  drag?: React.ReactNode;
  edit?: React.ReactNode;
  delete?: React.ReactNode;
};

type Props = {
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

export type BlocksFieldHandle = {
  /**
   * Scrolls the block at `index` into view. Safe to call straight after adding
   * a block: the scroll waits until that block has rendered.
   */
  scrollToBlock: (index: number) => void;
};

function BlocksField(
  {
    blockTypes,
    field,
    renderers,
    previews,
    icons,
    errors,
    blockComponents,
    canEditBlockList = false,
    header,
    footer,
    emptyState,
  }: Props,
  ref: React.ForwardedRef<BlocksFieldHandle>,
) {
  const blocks = field.value ?? [];
  const [pendingDeleteIndex, setPendingDeleteIndex] = React.useState<
    number | null
  >(null);
  const [pendingScrollIndex, setPendingScrollIndex] = React.useState<
    number | null
  >(null);
  const blockElementsRef = React.useRef(new Map<string, HTMLElement>());

  React.useImperativeHandle(
    ref,
    () => ({ scrollToBlock: (index) => setPendingScrollIndex(index) }),
    [],
  );

  const {
    keys,
    replace: updateBlock,
    remove: deleteBlock,
    move: moveBlock,
  } = useKeyedList(blocks, field.handleValueChange);
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

  React.useEffect(() => {
    if (pendingScrollIndex === null) return;
    setPendingScrollIndex(null);
    const key = keys[pendingScrollIndex];
    if (key === undefined) return;
    blockElementsRef.current
      .get(key)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [keys, pendingScrollIndex]);

  return (
    <>
      <Stack spacing={canEditBlockList ? 3 : 2}>
        {header}
        {blocks.length === 0 && emptyState}
        <SortableList ids={keys} onMove={moveBlock}>
          {blocks.map((block, index) => {
            const key = keys[index];
            if (key === undefined) {
              throw new Error(`Block ${index} has no key`);
            }
            return (
              <BlockCard
                key={key}
                sortableId={key}
                elementRef={(element) => {
                  if (element) blockElementsRef.current.set(key, element);
                  else blockElementsRef.current.delete(key);
                }}
                block={block}
                blockType={blockTypesByKey[block.type]}
                component={blockComponents?.[block.type]}
                renderers={renderers}
                previews={previews}
                icons={icons}
                errors={errors}
                errorPath={String(index)}
                canReorder={canEditBlockList}
                onChange={(next) => updateBlock(index, next)}
                onDelete={
                  canEditBlockList
                    ? () => setPendingDeleteIndex(index)
                    : undefined
                }
              />
            );
          })}
        </SortableList>
        {footer}
      </Stack>
      <ConfirmDialog
        open={pendingDeleteIndex !== null}
        title="Delete block"
        description="Are you sure you want to delete this block?"
        confirmText="Delete"
        onClose={() => setPendingDeleteIndex(null)}
        onConfirm={() => {
          if (pendingDeleteIndex !== null) deleteBlock(pendingDeleteIndex);
          setPendingDeleteIndex(null);
        }}
      />
    </>
  );
}

export default React.forwardRef(BlocksField);
