import type { Block, BlockType } from '../types';
import emptyFieldValue from './empty-field-value';

export default function createBlock(blockType: BlockType): Block {
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
