import { type CollisionDetection, closestCenter } from '@dnd-kit/core';

// Inserts where the pointer sits among the other items' midpoints, laid out as
// if the dragged item were removed, so its own height (a long block) never counts.
const pointerInsertion: CollisionDetection = (args) => {
  const { active, droppableContainers, droppableRects, pointerCoordinates } =
    args;
  if (!pointerCoordinates) return closestCenter(args);

  const items = droppableContainers
    .flatMap((container) => {
      const rect = droppableRects.get(container.id);
      return rect ? [{ container, rect }] : [];
    })
    .sort((a, b) => a.rect.top - b.rect.top);
  const from = items.findIndex(({ container }) => container.id === active.id);
  const next = items[from + 1];
  const activeItem = items[from];
  const removedGap =
    activeItem && next ? next.rect.top - activeItem.rect.top : 0;

  const to = items.filter(({ rect }, index) => {
    if (index === from) return false;
    const top = index > from ? rect.top - removedGap : rect.top;
    return pointerCoordinates.y > top + rect.height / 2;
  }).length;

  const target = items[to];
  return target
    ? [
        {
          id: target.container.id,
          data: { droppableContainer: target.container },
        },
      ]
    : [];
};

export default pointerInsertion;
