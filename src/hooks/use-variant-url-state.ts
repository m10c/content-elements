'use client';

export type VariantUrlState = {
  value: string;
  reference: string | null;
  showReference: boolean;
  setValue: (value: string) => void;
  setReference: (reference: string | null) => void;
  closeReference: () => void;
};

type Options = {
  key: string;
  params: Record<string, string | undefined>;
  defaultValue: string;
  navigate: (next: Record<string, string | null>) => void;
};

const REFERENCE_PARAM = 'ref';
const EMPTY_REFERENCE = '_';

export default function useVariantUrlState({
  key,
  params,
  defaultValue,
  navigate,
}: Options): VariantUrlState {
  const referenceParam = params[REFERENCE_PARAM];

  return {
    value: params[key] ?? defaultValue,
    reference:
      referenceParam === EMPTY_REFERENCE ? null : (referenceParam ?? null),
    showReference: Boolean(referenceParam),
    setValue: (next) => navigate({ [key]: next }),
    setReference: (next) =>
      navigate({ [REFERENCE_PARAM]: next ?? EMPTY_REFERENCE }),
    closeReference: () => navigate({ [REFERENCE_PARAM]: null }),
  };
}
