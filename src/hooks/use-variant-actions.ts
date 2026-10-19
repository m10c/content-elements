'use client';

import { useInvalidation } from 'api-read-hook';

import { useVariantEditorContext } from '../contexts';
import type { Dimension, Translations, VariantBase } from '../types';

type SubmitHelpers = {
  addSubmitError: (field: string, error: string) => void;
  setLoading: (loading: boolean) => void;
};

type Options<V extends VariantBase> = {
  identityIri: string;
  variantsPath: string;
  entityLabel: string;
  listPath: string;
  dimension: Dimension;
  variants: readonly V[];
  value: string;
  currentVariant: V | null;
};

export type VariantActionHandlers = {
  translate: (
    fields: string[],
    source: VariantBase,
  ) => Promise<Translations | null>;
  submit: (
    values: Record<string, unknown>,
    helpers: SubmitHelpers,
  ) => Promise<boolean>;
  publish: (publishAt: string) => Promise<boolean>;
  unpublish: () => Promise<boolean>;
  remove: () => Promise<boolean>;
  invalidate: () => void;
};

export default function useVariantActions<V extends VariantBase>({
  identityIri,
  variantsPath,
  entityLabel,
  listPath,
  dimension,
  variants,
  value,
  currentVariant,
}: Options<V>): VariantActionHandlers {
  const { callApi, toast, push } = useVariantEditorContext();
  const { invalidateMatching } = useInvalidation();

  const invalidate = () => invalidateMatching(identityIri);

  return {
    translate: async (fields, source) => {
      const response = await callApi<{ translations: Translations }>(
        `${source['@id']}/translate`,
        { method: 'POST', jsonBody: { targetLocale: value, fields } },
      );
      return response?.data.translations ?? null;
    },

    submit: async (values, { addSubmitError, setLoading }) => {
      setLoading(true);
      const response = currentVariant
        ? await callApi(
            currentVariant['@id'],
            { method: 'PATCH', jsonBody: values },
            { addSubmitError },
          )
        : await callApi(
            variantsPath,
            {
              method: 'POST',
              jsonBody: {
                ...values,
                identity: identityIri,
                [dimension.key]: value,
              },
            },
            { addSubmitError },
          );
      setLoading(false);
      if (!response) return false;
      toast.success(`${entityLabel} saved`);
      invalidate();
      return true;
    },

    publish: async (publishAt) => {
      if (!currentVariant) return false;
      const response = await callApi(`${currentVariant['@id']}/publish`, {
        method: 'POST',
        jsonBody: { publishAt },
      });
      if (!response) return false;
      toast.success(`${entityLabel} published`);
      invalidate();
      return true;
    },

    unpublish: async () => {
      if (!currentVariant) return false;
      const response = await callApi(`${currentVariant['@id']}/unpublish`, {
        method: 'POST',
        jsonBody: {},
      });
      if (!response) return false;
      toast.success(`${entityLabel} unpublished`);
      invalidate();
      return true;
    },

    remove: async () => {
      if (!currentVariant) return false;
      const response = await callApi(currentVariant['@id'], {
        method: 'DELETE',
      });
      if (!response) return false;
      if (variants.length === 1) {
        toast.success(`${entityLabel} deleted`);
        push(listPath);
      } else {
        toast.success(`${dimension.label} deleted`);
        invalidate();
      }
      return true;
    },

    invalidate,
  };
}
