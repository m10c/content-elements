'use client';

import { useVariantEditorContext } from '../contexts';
import type {
  DimensionOption,
  VariantBase,
  VariantDetailBase,
} from '../types';
import useVariantEditor, {
  type UseVariantEditorOptions,
  type VariantEditorState,
} from './use-variant-editor';
import useVariantUrlState from './use-variant-url-state';

type UseLocaleVariantEditorOptions<
  V extends VariantBase & { locale: string },
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
> = Omit<
  UseVariantEditorOptions<V, D, T>,
  'getValue' | 'dimensionField' | 'dimension' | 'options'
> & {
  options?: readonly DimensionOption[];
};

export default function useLocaleVariantEditor<
  V extends VariantBase & { locale: string },
  D extends VariantDetailBase,
  T extends Record<string, unknown>,
>({
  options,
  translatable = true,
  ...rest
}: UseLocaleVariantEditorOptions<V, D, T>): VariantEditorState<V, D, T> {
  const { getParams, setParams, dimensionOptions } = useVariantEditorContext();
  const resolvedOptions = options ?? dimensionOptions;

  const dimension = useVariantUrlState({
    params: getParams(),
    defaultValue:
      rest.defaultValue ??
      rest.variants[0]?.locale ??
      resolvedOptions[0]?.value ??
      '',
    navigate: setParams,
  });

  return useVariantEditor<V, D, T>({
    ...rest,
    getValue: (variant) => variant.locale,
    dimensionField: 'locale',
    dimension,
    options: resolvedOptions,
    translatable,
  });
}
