'use client';

import React from 'react';
import { type FormObject, useForm } from 'react-typed-form';

type FormObjectSubmit<T extends Record<string, unknown>> = Parameters<
  typeof useForm<T>
>[0] extends { onSubmit: infer S }
  ? S
  : never;

type UseVariantFormOptions<T extends Record<string, unknown>> = {
  savedValues: T;
  resetKey: string;
  onSubmit: FormObjectSubmit<Partial<T>>;
};

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export default function useVariantForm<T extends Record<string, unknown>>({
  savedValues,
  resetKey,
  onSubmit,
}: UseVariantFormOptions<T>): FormObject<T> {
  const form = useForm<Partial<T>>({
    defaultValues: {},
    pristineValues: savedValues,
    onSubmit,
  });

  const { reset } = form;
  useIsomorphicLayoutEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return form as FormObject<T>;
}
