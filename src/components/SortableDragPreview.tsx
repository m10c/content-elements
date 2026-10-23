'use client';

import { DragOverlay, useDndContext } from '@dnd-kit/core';
import { Box } from '@mui/material';
import React from 'react';

export default function SortableDragPreview() {
  const { activeNode } = useDndContext();

  // Inline margin beats the parent Stack's spacing margin on this extra child.
  return (
    <DragOverlay style={{ margin: 0 }}>
      {activeNode && <ElementPreview element={activeNode} />}
    </DragOverlay>
  );
}

function ElementPreview({ element }: { element: HTMLElement }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const clone = element.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return;
    clone.style.opacity = '';
    clone.style.transform = '';
    copyFieldValues(element, clone);
    containerRef.current?.replaceChildren(clone);
  }, [element]);

  return (
    <Box
      ref={containerRef}
      sx={{ width: element.offsetWidth, cursor: 'grabbing' }}
    />
  );
}

// cloneNode copies attributes, not what has been typed into a field since.
function copyFieldValues(source: HTMLElement, clone: HTMLElement) {
  const selector = 'input, textarea, select';
  const sourceFields = source.querySelectorAll(selector);
  clone.querySelectorAll(selector).forEach((field, index) => {
    const sourceField = sourceFields[index];
    if (hasValue(field) && hasValue(sourceField)) {
      field.value = sourceField.value;
    }
  });
}

function hasValue(
  element: Element | undefined,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}
