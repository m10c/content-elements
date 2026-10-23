'use client';

import React from 'react';

import type { VariantEditorConfig } from '../types';

const VariantEditorContext = React.createContext<VariantEditorConfig | null>(
  null,
);

type Props = VariantEditorConfig & {
  children: React.ReactNode;
};

export function VariantEditorProvider({ children, ...config }: Props) {
  return (
    <VariantEditorContext.Provider value={config}>
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
