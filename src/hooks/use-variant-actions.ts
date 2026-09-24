'use client';

import { useInvalidation } from 'api-read-hook';

import { useVariantEditorContext } from '../contexts';
import type {
  SubmitHelpers,
  Translations,
  VariantBase,
  VariantEntity,
} from '../types';

type UseVariantActionsOptions<V extends VariantBase> = {
  entity: VariantEntity;
  listPath: string;
  variants: readonly V[];
  getValue: (variant: V) => string;
  dimensionField: string;
  value: string;
};

export type VariantActionHandlers<D> = {
  identityIri: string;
  fetchDetail: (variant: { id: string }) => Promise<D | null>;
  translate: (
    fields: string[],
    source: { id: string },
  ) => Promise<Translations | null>;
  submit: (
    values: Record<string, unknown>,
    helpers: SubmitHelpers,
  ) => Promise<boolean>;
  publish: (publishAt: string) => Promise<boolean>;
  unpublish: () => Promise<boolean>;
  remove: () => Promise<boolean>;
  bulkPublish: (ids: string[], publishAt: string) => Promise<boolean>;
  bulkUnpublish: (ids: string[]) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  invalidate: () => void;
};

export default function useVariantActions<V extends VariantBase, D>({
  entity,
  listPath,
  variants,
  getValue,
  dimensionField,
  value,
}: UseVariantActionsOptions<V>): VariantActionHandlers<D> {
  const { callApi, toast, push } = useVariantEditorContext();
  const { invalidateMatching } = useInvalidation();

  const { slug, identityId, entityLabel } = entity;
  const collection = entity.identityCollection ?? `${slug}s`;
  const identityIri = `/${collection}/${identityId}`;
  const variantsPath = `/${slug}-variants`;
  const currentVariant =
    variants.find((variant) => getValue(variant) === value) ?? null;

  const invalidate = () => invalidateMatching(identityIri);

  const runAll = async (paths: string[], method: 'POST' | 'DELETE', body?: unknown) => {
    const results = await Promise.all(
      paths.map((path) =>
        callApi(path, { method, jsonBody: method === 'POST' ? body : undefined }),
      ),
    );
    return results.every(Boolean);
  };

  const plural = (count: number) =>
    `${count} ${count === 1 ? 'language' : 'languages'}`;

  return {
    identityIri,

    fetchDetail: async ({ id }) => {
      const response = await callApi<D>(`${variantsPath}/${id}`);
      return response?.data ?? null;
    },

    translate: async (fields, source) => {
      const response = await callApi<{ translations: Translations }>(
        `${variantsPath}/${source.id}/translate`,
        { method: 'POST', jsonBody: { targetLocale: value, fields } },
      );
      return response?.data.translations ?? null;
    },

    submit: async (values, { addSubmitError, setLoading }) => {
      setLoading(true);
      const response = currentVariant
        ? await callApi(
            `${variantsPath}/${currentVariant.id}`,
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
                [dimensionField]: value,
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
      const response = await callApi(
        `${variantsPath}/${currentVariant.id}/publish`,
        { method: 'POST', jsonBody: { publishAt } },
      );
      if (!response) return false;
      toast.success(`${entityLabel} published`);
      invalidate();
      return true;
    },

    unpublish: async () => {
      if (!currentVariant) return false;
      const response = await callApi(
        `${variantsPath}/${currentVariant.id}/unpublish`,
        { method: 'POST', jsonBody: {} },
      );
      if (!response) return false;
      toast.success(`${entityLabel} unpublished`);
      invalidate();
      return true;
    },

    remove: async () => {
      if (!currentVariant) return false;
      const isLast = variants.length === 1;
      const response = await callApi(`${variantsPath}/${currentVariant.id}`, {
        method: 'DELETE',
      });
      if (!response) {
        toast.error(`Failed to delete ${entityLabel}`);
        return false;
      }
      toast.success(`${entityLabel} deleted`);
      if (isLast) push(listPath);
      else invalidate();
      return true;
    },

    bulkPublish: async (ids, publishAt) => {
      const success = await runAll(
        ids.map((id) => `${variantsPath}/${id}/publish`),
        'POST',
        { publishAt },
      );
      if (success) {
        toast.success(`${plural(ids.length)} published`);
        invalidate();
      }
      return success;
    },

    bulkUnpublish: async (ids) => {
      const success = await runAll(
        ids.map((id) => `${variantsPath}/${id}/unpublish`),
        'POST',
        {},
      );
      if (success) {
        toast.success(`${plural(ids.length)} unpublished`);
        invalidate();
      }
      return success;
    },

    bulkDelete: async (ids) => {
      const isDeletingAll = ids.length === variants.length;
      const success = await runAll(
        ids.map((id) => `${variantsPath}/${id}`),
        'DELETE',
      );
      if (success) {
        toast.success(`${plural(ids.length)} deleted`);
        if (isDeletingAll) push(listPath);
        else invalidate();
      }
      return success;
    },

    invalidate,
  };
}
