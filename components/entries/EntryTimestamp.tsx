interface Props {
  created: string;
  updated?: string;
  revisedCount?: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function EntryTimestamp({ created, updated, revisedCount }: Props) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
      <span>{formatDate(created)}</span>
      {updated && updated !== created && (
        <span>updated {formatDate(updated)}</span>
      )}
      {revisedCount != null && revisedCount > 0 && (
        <span>revised {revisedCount}x</span>
      )}
    </div>
  );
}
