import type { VariantBase } from '../types';

export default function dimensionValue(
  variant: VariantBase,
  key: string,
): string {
  const value = (variant as Record<string, unknown>)[key];
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`Variant ${variant['@id']} has no "${key}" value`);
  }
  return String(value);
}
