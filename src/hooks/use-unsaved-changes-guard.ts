'use client';

import { useRef, useState } from 'react';

type Options = {
  hasUnsavedChanges: boolean;
  onSave: () => Promise<boolean>;
};

export type UnsavedChangesGuard = {
  guard: (action: () => void) => void;
  guardNavigate: (navigate: () => void) => Promise<boolean>;
  hasUnsavedChanges: boolean;
  hasPending: boolean;
  handlePending: (save: boolean) => Promise<void>;
  dismissPending: () => void;
};

export default function useUnsavedChangesGuard({
  hasUnsavedChanges,
  onSave,
}: Options): UnsavedChangesGuard {
  const [hasPending, setHasPending] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const guard = (action: () => void) => {
    if (hasUnsavedChanges) {
      pendingActionRef.current = action;
      setHasPending(true);
    } else {
      action();
    }
  };

  const guardNavigate = async (navigate: () => void): Promise<boolean> => {
    if (!hasUnsavedChanges) return true;
    guard(navigate);
    return false;
  };

  const handlePending = async (save: boolean) => {
    if (save) {
      const success = await onSave();
      if (!success) return;
    }
    pendingActionRef.current?.();
    pendingActionRef.current = null;
    setHasPending(false);
  };

  const dismissPending = () => {
    pendingActionRef.current = null;
    setHasPending(false);
  };

  return {
    guard,
    guardNavigate,
    hasUnsavedChanges,
    hasPending,
    handlePending,
    dismissPending,
  };
}
