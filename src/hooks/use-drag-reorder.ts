import React from 'react';

import type { DragRowProps } from '../types';

export default function useDragReorder(onMove: (from: number, to: number) => void) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  return (index: number): DragRowProps => ({
    onDragStart: (event: React.DragEvent) => {
      // A nested sortable list's drag bubbles up; only react to our own row.
      if (event.target !== event.currentTarget) return;
      setDraggedIndex(index);
    },
    onDragEnd: () => setDraggedIndex(null),
    onDragOver: (event: React.DragEvent) => event.preventDefault(),
    onDrop: () => {
      if (draggedIndex !== null && draggedIndex !== index) {
        onMove(draggedIndex, index);
      }
      setDraggedIndex(null);
    },
  });
}
