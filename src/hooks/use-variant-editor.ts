'use client';

import React from 'react';
import type { FormObject } from 'react-typed-form';

import type {
  DimensionOption,
  VariantBase,
  VariantDetailBase,
  VariantEntity,
} from '../types';
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
import type { VariantUrlState } from './use-variant-url-state';


export type UseVariantEditorOptions<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = {
  entity: VariantEntity;
  listPath: string;
  variants: readonly V[];
  getValue: (variant: V) => string;
  dimensionField: string;
  dimension: VariantUrlState;
  options: readonly DimensionOption[];
  defaultValue?: string;
  toFormValues: (detail: D | null) => T;
  translatable?: boolean;
};

export type VariantEditorState<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = {
  entity: VariantEntity;
  variants: readonly V[];
  getValue: (variant: V) => string;
  switcher: DimensionSwitcher<V, D>;
  form: FormObject<T>;
  guard: UnsavedChangesGuard;
  actions: VariantActionHandlers<D>;
  isPublished: boolean;
  isNewVariant: boolean;
  isLastVariant: boolean;
  switchTo: (value: string) => void;
  save: () => Promise<boolean>;
  remove: () => Promise<boolean>;
  applyTranslation: (fields: string[]) => Promise<boolean>;
};

export default function useVariantEditor<
  V extends VariantBase,
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
>({
  entity,
  listPath,
  variants,
  getValue,
  dimensionField,
  dimension,
  options,
  defaultValue,
  toFormValues,
  translatable = false,
}: UseVariantEditorOptions<V, D, T>): VariantEditorState<V, D, T> {
  const actions = useVariantActions<V, D>({
    entity,
    listPath,
    variants,
    getValue,
    dimensionField,
    value: dimension.value,
  });

  const switcher = useDimensionSwitcher<V, D>({
    variants,
    options,
    getValue,
    value: dimension.value,
    onValueChange: dimension.setValue,
    reference: dimension.reference,
    onReferenceChange: dimension.setReference,
    showReference: dimension.showReference,
    defaultValue,
    fetchDetail: actions.fetchDetail,
    translate: translatable ? actions.translate : undefined,
  });

  const { currentVariant, currentDetail } = switcher;
  const savedValues = React.useMemo(
    () => toFormValues(currentDetail),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDetail],
  );

  const form = useVariantForm<T>({
    savedValues,
    resetKey: `${currentVariant?.id ?? `new:${dimension.value}`}:${currentDetail?.updatedAt ?? ''}`,
    onSubmit: async (values, { addSubmitError, setLoading }) => {
      const success = await actions.submit(values, {
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
    const success = await actions.remove();
    if (!success) return false;
    const remaining = variants.find((variant) => variant !== currentVariant);
    if (remaining) switcher.setValue(getValue(remaining));
    return true;
  };

  const applyTranslation = async (fields: string[]) => {
    const translations = await switcher.translate(fields);
    if (!translations) return false;
    Object.entries(translations).forEach(([name, translated]) => {
      form
        .getField(name as keyof T)
        .handleValueChange(translated as T[keyof T]);
    });
    return true;
  };

  return {
    entity,
    variants,
    getValue,
    switcher,
    form,
    guard,
    actions,
    isPublished: currentVariant?.publishAt != null,
    isNewVariant: currentVariant === null,
    isLastVariant: variants.length === 1,
    switchTo: (value) => guard.guard(() => switcher.setValue(value)),
    save: () => form.handleSubmit(),
    remove,
    applyTranslation,
  };
}
