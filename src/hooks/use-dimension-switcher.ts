'use client';

import { useApiRead } from 'api-read-hook';

import type {
  Dimension,
  DimensionChip,
  VariantBase,
  VariantDetailBase,
} from '../types';
import dimensionValue from '../utils/dimension-value';
import publishStatusChip from '../utils/publish-status-chip';

type Options<V extends VariantBase> = {
  dimension: Dimension;
  variants: readonly V[];
  value: string;
  onValueChange: (value: string) => void;
  publishable?: boolean;
};

export type DimensionSwitcher<
  V extends VariantBase,
  D extends VariantDetailBase,
> = {
  dimension: Dimension;
  value: string;
  isDefault: boolean;
  currentVariant: V | null;
  sourceVariant: V | null;
  currentDetail: D | null;
  isLoadingDetail: boolean;
  hasDetailError: boolean;
  reloadDetail: () => void;
  setValue: (value: string) => void;
  getLabel: (value: string) => string;
  getChips: (value: string) => DimensionChip[];
};

export default function useDimensionSwitcher<
  V extends VariantBase,
  D extends VariantDetailBase,
>({
  dimension,
  variants,
  value,
  onValueChange,
  publishable = true,
}: Options<V>): DimensionSwitcher<V, D> {
  const findVariant = (target: string | undefined) =>
    variants.find(
      (variant) => dimensionValue(variant, dimension.key) === target,
    ) ?? null;

  const currentVariant = findVariant(value);
  const defaultVariant = findVariant(dimension.defaultValue);
  const otherVariants = variants.filter(
    (variant) => variant !== currentVariant,
  );
  const sourceVariant =
    (defaultVariant !== currentVariant ? defaultVariant : null) ??
    (otherVariants.length === 1 ? (otherVariants[0] ?? null) : null);

  const detailRead = useApiRead<D>(currentVariant?.['@id'] ?? null, {
    staleWhileInvalidated: true,
  });
  // useApiRead returns the previous path's data for one render after the path changes
  const currentDetail =
    detailRead.data && detailRead.data['@id'] === currentVariant?.['@id']
      ? detailRead.data
      : null;
  const hasDetailError =
    currentDetail === null && detailRead.error !== undefined;

  const getChips = (target: string) => {
    const chips: DimensionChip[] = [];
    if (target === dimension.defaultValue) {
      chips.push({ label: 'Default', color: 'default' });
    }
    const variant = findVariant(target);
    if (publishable && variant) chips.push(publishStatusChip(variant.publishAt));
    return chips;
  };

  return {
    dimension,
    value,
    isDefault: value === dimension.defaultValue,
    currentVariant,
    sourceVariant,
    currentDetail,
    isLoadingDetail:
      currentVariant !== null && currentDetail === null && !hasDetailError,
    hasDetailError,
    reloadDetail: detailRead.invalidate,
    setValue: onValueChange,
    getLabel: (target) =>
      dimension.options.find((option) => option.value === target)?.label ??
      target,
    getChips,
  };
}
