import React from 'react';

import moveItem from '../utils/move-item';

export default function useListKeys(length: number) {
  const nextKeyRef = React.useRef(0);
  const keysRef = React.useRef<string[]>([]);
  if (keysRef.current.length !== length) {
    keysRef.current = Array.from(
      { length },
      (_, index) => keysRef.current[index] ?? `item-${nextKeyRef.current++}`,
    );
  }

  return {
    keys: keysRef.current,
    moveKey: (from: number, to: number) => {
      keysRef.current = moveItem(keysRef.current, from, to);
    },
    removeKey: (index: number) => {
      keysRef.current = keysRef.current.filter((_, i) => i !== index);
    },
  };
}
