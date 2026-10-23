import { useSortable } from '@dnd-kit/sortable';

export default function useSortableItem(id: string, disabled = false) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return {
    itemProps: {
      ref: setNodeRef,
      style: {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        position: 'relative' as const,
        opacity: isDragging ? 0 : undefined,
      },
    },
    // Only the handle starts a drag, so text inside the item stays selectable.
    handleProps: {
      ref: setActivatorNodeRef,
      ...attributes,
      ...listeners,
      style: { touchAction: 'none', cursor: 'grab' },
    },
  };
}
