export default function moveItem<T>(
  items: readonly T[],
  from: number,
  to: number,
) {
  const updated = items.slice();
  const [moved] = updated.splice(from, 1);
  if (moved === undefined) return updated;
  updated.splice(to, 0, moved);
  return updated;
}
