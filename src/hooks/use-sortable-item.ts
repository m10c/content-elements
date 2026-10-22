import { useSortable } from '@dnd-kit/sortable';

export type DropSide = 'before' | 'after';

export default function useSortableItem(id: string, disabled = false) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    index,
    activeIndex,
    overIndex,
  } = useSortable({ id, disabled });

  // Matches how onMove places the item: after the hovered item when dragging
  // down, before it when dragging up.
  const dropSide: DropSide | null =
    activeIndex === -1 || index !== overIndex || activeIndex === overIndex
      ? null
      : activeIndex < overIndex
        ? 'after'
        : 'before';

  return {
    itemProps: {
      ref: setNodeRef,
      style: {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        position: 'relative' as const,
        zIndex: isDragging ? 1 : undefined,
      },
    },
    isDragging,
    dropSide,
    // Only the handle starts a drag, so text inside the item stays selectable.
    handleProps: {
      ref: setActivatorNodeRef,
      ...attributes,
      ...listeners,
      style: { touchAction: 'none', cursor: 'grab' },
    },
  };
}
