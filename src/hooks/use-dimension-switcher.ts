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
import type { VariantUrlState } from './use-variant-url-state';

type Options<V extends VariantBase> = {
  dimension: Dimension;
  variants: readonly V[];
  urlState: VariantUrlState;
  publishable?: boolean;
};

export type DimensionSwitcher<
  V extends VariantBase,
  D extends VariantDetailBase,
> = {
  dimension: Dimension;
  value: string;
  reference: string | null;
  showReference: boolean;
  shouldShowReferenceToggle: boolean;
  isDefault: boolean;
  currentVariant: V | null;
  referenceVariant: V | null;
  sourceVariant: V | null;
  currentDetail: D | null;
  referenceDetail: D | null;
  isLoadingDetail: boolean;
  hasDetailError: boolean;
  reloadDetail: () => void;
  setValue: (value: string) => void;
  setReference: (reference: string | null) => void;
  toggleReference: () => void;
  getLabel: (value: string) => string;
  getChips: (value: string) => DimensionChip[];
};

function useVariantDetail<D extends VariantDetailBase>(
  variant: VariantBase | null,
) {
  const read = useApiRead<D>(variant?.['@id'] ?? null, {
    staleWhileInvalidated: true,
  });
  // useApiRead returns the previous path's data for one render after the path changes
  const detail =
    read.data && read.data['@id'] === variant?.['@id'] ? read.data : null;
  return { detail, error: read.error, reload: read.invalidate };
}

export default function useDimensionSwitcher<
  V extends VariantBase,
  D extends VariantDetailBase,
>({
  dimension,
  variants,
  urlState,
  publishable = true,
}: Options<V>): DimensionSwitcher<V, D> {
  const { value, reference, showReference } = urlState;

  const findVariant = (target: string | null | undefined) =>
    target == null
      ? null
      : (variants.find(
          (variant) => dimensionValue(variant, dimension.key) === target,
        ) ?? null);

  const currentVariant = findVariant(value);
  const referenceVariant = showReference ? findVariant(reference) : null;
  const defaultVariant = findVariant(dimension.defaultValue);
  const otherVariants = variants.filter(
    (variant) => variant !== currentVariant,
  );
  const onlyOtherVariant =
    otherVariants.length === 1 ? (otherVariants[0] ?? null) : null;
  const sourceVariant =
    (referenceVariant !== currentVariant ? referenceVariant : null) ??
    (defaultVariant !== currentVariant ? defaultVariant : null) ??
    onlyOtherVariant;

  const current = useVariantDetail<D>(currentVariant);
  const referenceRead = useVariantDetail<D>(referenceVariant);
  const hasDetailError =
    current.detail === null && current.error !== undefined;

  const getLabel = (target: string) =>
    dimension.options.find((option) => option.value === target)?.label ??
    target;

  const getChips = (target: string) => {
    const chips: DimensionChip[] = [];
    if (target === dimension.defaultValue) {
      chips.push({ label: 'Default', color: 'default' });
    }
    const variant = findVariant(target);
    if (publishable && variant) chips.push(publishStatusChip(variant.publishAt));
    return chips;
  };

  const toggleReference = () => {
    if (showReference) {
      urlState.closeReference();
    } else {
      urlState.setReference(
        onlyOtherVariant ? dimensionValue(onlyOtherVariant, dimension.key) : null,
      );
    }
  };

  return {
    dimension,
    value,
    reference,
    showReference,
    shouldShowReferenceToggle: otherVariants.length > 0,
    isDefault: value === dimension.defaultValue,
    currentVariant,
    referenceVariant,
    sourceVariant,
    currentDetail: current.detail,
    referenceDetail: referenceRead.detail,
    isLoadingDetail:
      currentVariant !== null && current.detail === null && !hasDetailError,
    hasDetailError,
    reloadDetail: current.reload,
    setValue: urlState.setValue,
    setReference: urlState.setReference,
    toggleReference,
    getLabel,
    getChips,
  };
}
