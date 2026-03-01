interface Props {
  status: string;
}

export function StatusIndicator({ status }: Props) {
  return (
    <span className="text-xs text-secondary">
      {status}
    </span>
  );
}
