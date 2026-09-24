'use client';

import { format, isFuture, parseISO } from 'date-fns';
import React from 'react';

import type {
  DimensionChip,
  DimensionOption,
  Translate,
  Translations,
  VariantBase,
} from '../types';


type FetchDetail<D> = (variant: {
  id: string;
  value: string;
}) => Promise<D | null>;

type UseDimensionSwitcherOptions<V extends VariantBase, D> = {
  variants: readonly V[];
  options: readonly DimensionOption[];
  getValue: (variant: V) => string;
  value: string;
  onValueChange: (value: string) => void;
  reference: string | null;
  onReferenceChange: (reference: string | null) => void;
  showReference: boolean;
  defaultValue?: string;
  fetchDetail: FetchDetail<D>;
  translate?: Translate;
  showPublishChip?: boolean;
};

export type DimensionSwitcher<V extends VariantBase, D> = {
  value: string;
  reference: string | null;
  showReference: boolean;
  shouldShowReferenceToggle: boolean;
  defaultValue: string | null;
  isDefault: boolean;

  currentVariant: V | null;
  referenceVariant: V | null;
  sourceVariant: V | null;
  currentDetail: D | null;
  referenceDetail: D | null;
  isLoadingDetail: boolean;
  reloadDetail: () => void;

  options: readonly DimensionOption[];
  setValue: (value: string) => void;
  setReference: (reference: string | null) => void;
  toggleReference: () => void;
  getChips: (value: string) => DimensionChip[];

  canTranslate: boolean;
  translatingField: string | null;
  translate: (fields: string[]) => Promise<Translations | null>;
};

export default function useDimensionSwitcher<V extends VariantBase, D>({
  variants,
  options,
  getValue,
  value,
  onValueChange,
  reference,
  onReferenceChange,
  showReference,
  defaultValue,
  fetchDetail,
  translate: translateFn,
  showPublishChip = true,
}: UseDimensionSwitcherOptions<V, D>): DimensionSwitcher<V, D> {
  const [translatingField, setTranslatingField] = React.useState<
    string | null
  >(null);
  const [reloadCount, setReloadCount] = React.useState(0);
  const [currentDetailState, setCurrentDetailState] = React.useState<{
    value: string;
    data: D;
  } | null>(null);
  const [referenceDetailState, setReferenceDetailState] = React.useState<{
    value: string;
    data: D;
  } | null>(null);

  const findVariant = (dimensionValue: string | null | undefined) =>
    dimensionValue == null
      ? null
      : (variants.find((variant) => getValue(variant) === dimensionValue) ??
        null);

  const currentVariant = findVariant(value);
  const referenceVariant = findVariant(reference);
  const defaultVariant = findVariant(defaultValue);

  const currentDetail =
    currentDetailState && currentDetailState.value === value && currentVariant
      ? currentDetailState.data
      : null;
  const referenceDetail =
    referenceDetailState &&
    reference != null &&
    referenceDetailState.value === reference &&
    referenceVariant
      ? referenceDetailState.data
      : null;
  const isLoadingDetail = currentVariant !== null && currentDetail === null;

  const otherVariants = variants.filter(
    (variant) => getValue(variant) !== value,
  );
  const onlyOtherVariant =
    otherVariants.length === 1 ? (otherVariants[0] ?? null) : null;
  const sourceVariant =
    referenceVariant ??
    (defaultVariant && defaultVariant !== currentVariant
      ? defaultVariant
      : null) ??
    onlyOtherVariant;
  const canTranslate = Boolean(translateFn && sourceVariant);

  const shouldShowReferenceToggle =
    otherVariants.length >= 1 || (showReference && reference !== value);

  const translate = React.useCallback(
    async (fields: string[]): Promise<Translations | null> => {
      if (!translateFn || !sourceVariant) return null;
      setTranslatingField(fields.length === 1 ? (fields[0] ?? 'all') : 'all');
      try {
        return await translateFn(fields, {
          id: sourceVariant.id,
          value: getValue(sourceVariant),
        });
      } finally {
        setTranslatingField(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translateFn, sourceVariant?.id],
  );

  const toggleReference = () => {
    if (showReference) {
      onReferenceChange(null);
    } else {
      onReferenceChange(onlyOtherVariant ? getValue(onlyOtherVariant) : '_');
    }
  };

  const getChips = (optionValue: string): DimensionChip[] => {
    const chips: DimensionChip[] = [];
    if (defaultValue === optionValue) {
      chips.push({ label: 'Default', color: 'default' });
    }
    const variant = findVariant(optionValue);
    if (!showPublishChip || !variant) return chips;
    if (!variant.publishAt) {
      chips.push({ label: 'Draft', color: 'warning' });
      return chips;
    }
    const publishDate = parseISO(variant.publishAt);
    chips.push({
      label: format(publishDate, 'dd MMM yyyy'),
      color: isFuture(publishDate) ? 'info' : 'success',
    });
    return chips;
  };

  React.useEffect(() => {
    if (!currentVariant) return;
    fetchDetail({ id: currentVariant.id, value }).then((data) => {
      if (data) setCurrentDetailState({ value, data });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVariant?.id, value, reloadCount]);

  React.useEffect(() => {
    if (!referenceVariant || !showReference || reference == null) return;
    fetchDetail({ id: referenceVariant.id, value: reference }).then((data) => {
      if (data) setReferenceDetailState({ value: reference, data });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceVariant?.id, reference, showReference]);

  return {
    value,
    reference: showReference ? reference : null,
    showReference,
    shouldShowReferenceToggle,
    defaultValue: defaultValue ?? null,
    isDefault: defaultValue === value,
    currentVariant,
    referenceVariant,
    sourceVariant,
    currentDetail,
    referenceDetail,
    isLoadingDetail,
    reloadDetail: () => setReloadCount((count) => count + 1),
    options,
    setValue: onValueChange,
    setReference: onReferenceChange,
    toggleReference,
    getChips,
    canTranslate,
    translatingField,
    translate,
  };
}
