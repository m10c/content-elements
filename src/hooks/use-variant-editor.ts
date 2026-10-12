'use client';

import React from 'react';
import type { FormObject } from 'react-typed-form';

import { useVariantEditorContext } from '../contexts';
import type { Dimension, VariantBase, VariantDetailBase } from '../types';
import dimensionValue from '../utils/dimension-value';
import useDimensionSwitcher, {
  type DimensionSwitcher,
} from './use-dimension-switcher';
import useUnsavedChangesGuard, {
  type UnsavedChangesGuard,
} from './use-unsaved-changes-guard';
import useVariantActions, {
  type VariantActionHandlers,
} from './use-variant-actions';
import useVariantForm from './use-variant-form';

export type UseVariantEditorOptions<
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
  publishable?: boolean;
  postValidateTransform?: (values: Partial<T>) => Record<string, unknown>;
};

export type VariantEditorState<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = {
  entityLabel: string;
  dimension: Dimension;
  variants: readonly V[];
  publishable: boolean;
  switcher: DimensionSwitcher<V, D>;
  form: FormObject<T>;
  guard: UnsavedChangesGuard;
  actions: VariantActionHandlers;
  canTranslate: boolean;
  isPublished: boolean;
  isNewVariant: boolean;
  isLastVariant: boolean;
  switchTo: (value: string) => void;
  save: () => Promise<boolean>;
  remove: () => Promise<boolean>;
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
  publishable = true,
  postValidateTransform,
}: UseVariantEditorOptions<V, D, T>): VariantEditorState<V, D, T> {
  const { getParams, setParams, defaultDimension } = useVariantEditorContext();
  const dimension = dimensionOverride ?? defaultDimension;
  const firstVariant = variants[0];
  const initialValue =
    dimension.defaultValue ??
    (firstVariant
      ? dimensionValue(firstVariant, dimension.key)
      : dimension.options[0]?.value);
  if (!initialValue) {
    throw new Error(`Dimension "${dimension.key}" has no options`);
  }

  const switcher = useDimensionSwitcher<V, D>({
    dimension,
    variants,
    value: getParams()[dimension.key] ?? initialValue,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDetail],
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
    entityLabel,
    dimension,
    variants,
    publishable,
    switcher,
    form,
    guard,
    actions,
    canTranslate: Boolean(dimension.translatable) && sourceVariant !== null,
    isPublished: currentVariant?.publishAt != null,
    isNewVariant: currentVariant === null,
    isLastVariant: variants.length === 1,
    switchTo: (next) => guard.guard(() => switcher.setValue(next)),
    save: () => form.handleSubmit(),
    remove,
  };
}
