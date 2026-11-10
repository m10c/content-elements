import type { BlockTypeField } from '../types';

export default function emptyFieldValue(fieldDef: BlockTypeField) {
  if (fieldDef.kind === 'list') return [];
  if (fieldDef.kind === 'boolean') return false;
  return '';
}
