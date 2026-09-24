'use client';

import React from 'react';

import type { CallApi, DimensionOption } from '../types';

type VariantEditorContextValue = {
  callApi: CallApi;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
  push: (href: string) => void;
  getParams: () => { locale?: string; ref?: string };
  setParams: (next: { locale?: string; ref?: string | null }) => void;
  dimensionOptions: readonly DimensionOption[];
};

const VariantEditorContext =
  React.createContext<VariantEditorContextValue | null>(null);

type Props = VariantEditorContextValue & {
  children: React.ReactNode;
};

export function VariantEditorProvider({
  children,
  ...value
}: Props) {
  const memoed = React.useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      value.callApi,
      value.toast,
      value.push,
      value.getParams,
      value.setParams,
      value.dimensionOptions,
    ],
  );
  return (
    <VariantEditorContext.Provider value={memoed}>
      {children}
    </VariantEditorContext.Provider>
  );
}

export function useVariantEditorContext(): VariantEditorContextValue {
  const context = React.useContext(VariantEditorContext);
  if (!context) {
    throw new Error(
      'useVariantEditorContext must be used within a VariantEditorProvider',
    );
  }
  return context;
}
