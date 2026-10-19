'use client';

import React from 'react';

import type { CallApi, VariantEditorConfig } from '../types';

const VariantEditorContext = React.createContext<VariantEditorConfig | null>(
  null,
);

type Props = VariantEditorConfig & {
  children: React.ReactNode;
};

export function VariantEditorProvider({
  children,
  getParams,
  defaultDimension,
  ...actions
}: Props) {
  const actionsRef = React.useRef(actions);
  actionsRef.current = actions;

  const value = React.useMemo<VariantEditorConfig>(
    () => ({
      callApi: <R,>(...args: Parameters<CallApi>) =>
        actionsRef.current.callApi<R>(...args),
      toast: {
        success: (message) => actionsRef.current.toast.success(message),
      },
      push: (href) => actionsRef.current.push(href),
      setParams: (next) => actionsRef.current.setParams(next),
      getParams,
      defaultDimension,
    }),
    [getParams, defaultDimension],
  );
  return (
    <VariantEditorContext.Provider value={value}>
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
