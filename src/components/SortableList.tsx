'use client';

import {
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type React from 'react';

type Props = {
  ids: string[];
  onMove: (from: number, to: number) => void;
  children: React.ReactNode;
  /** Re-measure items throughout a drag, for items that change height mid-drag. */
  measureWhileDragging?: boolean;
};

export default function SortableList({
  ids,
  onMove,
  children,
  measureWhileDragging = false,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={
        measureWhileDragging
          ? { droppable: { strategy: MeasuringStrategy.Always } }
          : undefined
      }
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const from = ids.indexOf(String(active.id));
        const to = ids.indexOf(String(over.id));
        if (from === -1 || to === -1) return;
        onMove(from, to);
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
