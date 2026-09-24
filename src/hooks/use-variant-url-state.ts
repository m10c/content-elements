'use client';

export type VariantUrlState = {
  value: string;
  reference: string | null;
  showReference: boolean;
  setValue: (value: string) => void;
  setReference: (reference: string | null) => void;
};

type Options = {
  params: { locale?: string; ref?: string };
  defaultValue: string;
  navigate: (next: { locale?: string; ref?: string | null }) => void;
};

// ref === '_' means the reference panel is open with nothing selected
export default function useVariantUrlState({
  params,
  defaultValue,
  navigate,
}: Options): VariantUrlState {
  const referenceParam = params.ref;

  return {
    value: params.locale ?? defaultValue,
    reference: referenceParam === '_' ? null : (referenceParam ?? null),
    showReference: Boolean(referenceParam),
    setValue: (next) => navigate({ locale: next }),
    setReference: (next) => navigate({ ref: next }),
  };
}
