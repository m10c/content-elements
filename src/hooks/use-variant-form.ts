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

export default function useVariantForm<T extends Record<string, unknown>>({
  savedValues,
  resetKey,
  onSubmit,
}: UseVariantFormOptions<T>): FormObject<Partial<T>> {
  const form = useForm<Partial<T>>({
    defaultValues: {},
    pristineValues: savedValues,
    onSubmit,
  });

  const [formKey, setFormKey] = React.useState(resetKey);
  if (formKey !== resetKey) {
    setFormKey(resetKey);
    form.reset();
  }

  return form;
}
