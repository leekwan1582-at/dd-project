export function todayTag() {
  const d = new Date();
  const iso = d.toISOString().slice(0, 10);
  return `[dd-${iso}]`;
}

export function formatTimestamp(ts) {
  return new Date(ts).toLocaleString();
}
