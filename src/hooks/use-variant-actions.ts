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
  bulkPublish: (iris: string[], publishAt: string) => Promise<boolean>;
  bulkUnpublish: (iris: string[]) => Promise<boolean>;
  bulkDelete: (iris: string[]) => Promise<boolean>;
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
  const countLabel = (count: number) =>
    `${count} ${(count === 1 ? dimension.label : dimension.pluralLabel).toLowerCase()}`;

  const runEach = async (
    iris: string[],
    request: (iri: string) => Promise<unknown>,
    pastTense: string,
  ) => {
    let failedCount = 0;
    // Sequential, so the backend's "delete identity with its last variant" check sees an accurate count
    for (const iri of iris) {
      if (!(await request(iri))) failedCount += 1;
    }
    if (failedCount < iris.length) invalidate();
    if (failedCount > 0) {
      toast.error(`${countLabel(failedCount)} failed`);
    } else {
      toast.success(`${countLabel(iris.length)} ${pastTense}`);
    }
    return failedCount === 0;
  };

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
      if (!response) {
        toast.error(`Failed to delete ${entityLabel}`);
        return false;
      }
      toast.success(`${entityLabel} deleted`);
      if (variants.length === 1) push(listPath);
      else invalidate();
      return true;
    },

    bulkPublish: (iris, publishAt) =>
      runEach(
        iris,
        (iri) =>
          callApi(`${iri}/publish`, { method: 'POST', jsonBody: { publishAt } }),
        'published',
      ),

    bulkUnpublish: (iris) =>
      runEach(
        iris,
        (iri) => callApi(`${iri}/unpublish`, { method: 'POST', jsonBody: {} }),
        'unpublished',
      ),

    bulkDelete: async (iris) => {
      const success = await runEach(
        iris,
        (iri) => callApi(iri, { method: 'DELETE' }),
        'deleted',
      );
      if (success && iris.length === variants.length) push(listPath);
      return success;
    },

    invalidate,
  };
}
