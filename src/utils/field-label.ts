import type { BlockTypeField } from '../types';

export default function fieldLabel(fieldDef: BlockTypeField, fallback: string) {
  return `${fieldDef.label ?? fallback}${fieldDef.required ? '*' : ''}`;
}
