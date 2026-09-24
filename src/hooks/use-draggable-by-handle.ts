import React from 'react';

// Only the handle starts a drag, so text inside the row stays selectable.
export default function useDraggableByHandle() {
  const [isDraggable, setIsDraggable] = React.useState(false);

  return {
    isDraggable,
    stopDragging: () => setIsDraggable(false),
    handleProps: {
      onMouseDown: () => setIsDraggable(true),
      onMouseUp: () => setIsDraggable(false),
    },
  };
}
