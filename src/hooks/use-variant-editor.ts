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
import useVariantUrlState from './use-variant-url-state';

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
  isTranslating: boolean;
  isPublished: boolean;
  isNewVariant: boolean;
  isLastVariant: boolean;
  switchTo: (value: string) => void;
  save: () => Promise<boolean>;
  remove: () => Promise<boolean>;
  bulkDelete: (iris: string[]) => Promise<boolean>;
  applyTranslation: (fields: string[]) => Promise<boolean>;
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

  const urlState = useVariantUrlState({
    key: dimension.key,
    params: getParams(),
    defaultValue: initialValue,
    navigate: setParams,
  });
  const switcher = useDimensionSwitcher<V, D>({
    dimension,
    variants,
    urlState,
    publishable,
  });
  const { currentVariant, currentDetail, sourceVariant, value } = switcher;
  const [isTranslating, setIsTranslating] = React.useState(false);

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

  const switchAwayFromDeleted = (deletedIris: string[]) => {
    if (!currentVariant || !deletedIris.includes(currentVariant['@id'])) return;
    const remaining = variants.find(
      (variant) => !deletedIris.includes(variant['@id']),
    );
    if (remaining) switcher.setValue(dimensionValue(remaining, dimension.key));
  };

  const remove = async () => {
    if (!currentVariant) return false;
    const success = await actions.remove();
    if (success) switchAwayFromDeleted([currentVariant['@id']]);
    return success;
  };

  const bulkDelete = async (iris: string[]) => {
    const success = await actions.bulkDelete(iris);
    if (success) switchAwayFromDeleted(iris);
    return success;
  };

  const applyTranslation = async (fields: string[]) => {
    if (!sourceVariant) return false;
    setIsTranslating(true);
    try {
      const translations = await actions.translate(fields, sourceVariant);
      if (!translations) return false;
      Object.entries(translations).forEach(([name, translated]) => {
        form
          .getField(name as keyof T)
          .handleValueChange(translated as T[keyof T]);
      });
      return true;
    } finally {
      setIsTranslating(false);
    }
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
    isTranslating,
    isPublished: currentVariant?.publishAt != null,
    isNewVariant: currentVariant === null,
    isLastVariant: variants.length === 1,
    switchTo: (next) => guard.guard(() => switcher.setValue(next)),
    save: () => form.handleSubmit(),
    remove,
    bulkDelete,
    applyTranslation,
  };
}
