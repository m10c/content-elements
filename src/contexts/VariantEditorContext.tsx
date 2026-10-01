'use client';

import React from 'react';

import type { VariantEditorConfig } from '../types';

const VariantEditorContext = React.createContext<VariantEditorConfig | null>(
  null,
);

type Props = VariantEditorConfig & {
  children: React.ReactNode;
};

export function VariantEditorProvider({ children, ...value }: Props) {
  const memoed = React.useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      value.callApi,
      value.toast,
      value.push,
      value.getParams,
      value.setParams,
      value.defaultDimension,
    ],
  );
  return (
    <VariantEditorContext.Provider value={memoed}>
      {children}
    </VariantEditorContext.Provider>
  );
}

export function useVariantEditorContext(): VariantEditorConfig {
  const context = React.useContext(VariantEditorContext);
  if (!context) {
    throw new Error(
      'useVariantEditorContext must be used within a VariantEditorProvider',
    );
  }
  return context;
}
