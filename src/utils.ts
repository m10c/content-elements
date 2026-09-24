import type { Block, BlockType, BlockTypeField } from './types';

export function moveItem<T>(items: readonly T[], from: number, to: number) {
  const updated = items.slice();
  const [moved] = updated.splice(from, 1);
  if (moved === undefined) return updated;
  updated.splice(to, 0, moved);
  return updated;
}

export function emptyFieldValue(fieldDef: BlockTypeField) {
  if (fieldDef.kind === 'list') return [];
  if (fieldDef.kind === 'boolean') return false;
  return '';
}

export function createBlock(blockType: BlockType): Block {
  return {
    type: blockType.key,
    data: Object.fromEntries(
      Object.entries(blockType.fields).map(([key, fieldDef]) => [
        key,
        emptyFieldValue(fieldDef),
      ]),
    ),
  };
}
