import React from 'react';

import moveItem from '../utils/move-item';

export default function useKeyedList<T>(
  items: readonly T[],
  onChange: (items: T[]) => void,
) {
  const nextKeyRef = React.useRef(0);
  const keysRef = React.useRef<string[]>([]);
  if (keysRef.current.length !== items.length) {
    keysRef.current = Array.from(
      { length: items.length },
      (_, index) => keysRef.current[index] ?? `item-${nextKeyRef.current++}`,
    );
  }

  return {
    keys: keysRef.current,
    replace: (index: number, next: T) => {
      const updated = items.slice();
      updated[index] = next;
      onChange(updated);
    },
    remove: (index: number) => {
      keysRef.current = keysRef.current.filter((_, i) => i !== index);
      onChange(items.filter((_, i) => i !== index));
    },
    move: (from: number, to: number) => {
      keysRef.current = moveItem(keysRef.current, from, to);
      onChange(moveItem(items, from, to));
    },
  };
}
