'use client';

import React from 'react';

import { useVariantEditorContext } from '../contexts';
import type {
  Dimension,
  VariantBase,
  VariantDetailBase,
  VariantEditorState,
} from '../types';
import dimensionValue from '../utils/dimension-value';
import useDimensionSwitcher from './use-dimension-switcher';
import useUnsavedChangesGuard from './use-unsaved-changes-guard';
import useVariantActions from './use-variant-actions';
import useVariantForm from './use-variant-form';

type Options<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = {
  identityIri: string;
  variantsPath: string;
  entityLabel: string;
  listPath: string;
  variants: readonly V[];
  toFormValues: (detail: D | null) => T;
  dimension?: Dimension;
  defaultValue?: string;
  publishable?: boolean;
  postValidateTransform?: (values: Partial<T>) => Record<string, unknown>;
};

export default function useVariantEditor<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
>({
  identityIri,
  variantsPath,
  entityLabel,
  listPath,
  variants,
  toFormValues,
  dimension: dimensionOverride,
  defaultValue,
  publishable = true,
  postValidateTransform,
}: Options<V, D, T>): VariantEditorState<V, D, T> {
  const { getParams, setParams, defaultDimension } = useVariantEditorContext();
  const dimension = dimensionOverride ?? defaultDimension;
  const firstVariant = variants[0];
  const initialValue =
    defaultValue ??
    (firstVariant
      ? dimensionValue(firstVariant, dimension.key)
      : dimension.options[0]?.value);
  if (!initialValue) {
    throw new Error(`Dimension "${dimension.key}" has no options`);
  }
  const paramValue = getParams()[dimension.key];
  const isKnownValue = dimension.options.some(
    (option) => option.value === paramValue,
  );

  const switcher = useDimensionSwitcher<V, D>({
    dimension,
    defaultValue,
    variants,
    value: isKnownValue && paramValue ? paramValue : initialValue,
    onValueChange: (next) => setParams({ [dimension.key]: next }),
    publishable,
  });
  const { currentVariant, currentDetail, sourceVariant, value } = switcher;

  const actions = useVariantActions<V>({
    identityIri,
    variantsPath,
    entityLabel,
    listPath,
    dimension,
    variants,
    value,
    currentVariant,
  });

  const savedValues = React.useMemo(
    () => toFormValues(currentDetail),
    [toFormValues, currentDetail],
  );

  const form = useVariantForm<T>({
    savedValues,
    resetKey: `${currentVariant?.['@id'] ?? `new:${value}`}:${currentDetail?.updatedAt ?? ''}`,
    onSubmit: async (values, { addSubmitError, setLoading }) => {
      const body = postValidateTransform
        ? postValidateTransform(values)
        : values;
      const success = await actions.submit(body, {
        addSubmitError: (field, error) =>
          addSubmitError(field as keyof Partial<T>, error),
        setLoading,
      });
      if (success) switcher.reloadDetail();
      return success;
    },
  });

  const guard = useUnsavedChangesGuard({
    hasUnsavedChanges: form.hasDirty,
    onSave: () => form.handleSubmit(),
  });

  const [isTranslating, setIsTranslating] = React.useState(false);

  const translate = async (fields: string[]) => {
    if (!sourceVariant) return null;
    setIsTranslating(true);
    try {
      return await actions.translate(fields, sourceVariant);
    } finally {
      setIsTranslating(false);
    }
  };

  const remove = async () => {
    if (!currentVariant) return false;
    const success = await actions.remove();
    if (!success) return false;
    const remaining = variants.find(
      (variant) => variant['@id'] !== currentVariant['@id'],
    );
    if (remaining) switcher.setValue(dimensionValue(remaining, dimension.key));
    return true;
  };

  return {
    dimension,
    value,
    isDefault: switcher.isDefault,
    currentVariant,
    currentDetail,
    sourceVariant,
    isLoadingDetail: switcher.isLoadingDetail,
    hasDetailError: switcher.hasDetailError,
    reloadDetail: switcher.reloadDetail,
    getLabel: switcher.getLabel,
    getChips: switcher.getChips,
    form,
    guard,
    canTranslate: Boolean(dimension.translatable) && sourceVariant !== null,
    isTranslating,
    isPublished: currentVariant?.publishAt != null,
    isNewVariant: currentVariant === null,
    isLastVariant: variants.length === 1,
    switchTo: (next) => guard.guard(() => switcher.setValue(next)),
    save: () => form.handleSubmit(),
    publish: actions.publish,
    unpublish: actions.unpublish,
    remove,
    translate,
    invalidate: actions.invalidate,
  };
}
