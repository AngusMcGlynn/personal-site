"use client";

interface Props {
  tags: string[];
  activeTag?: string;
  onTagClick?: (tag: string) => void;
}

export function TagList({ tags, activeTag, onTagClick }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`text-xs px-2 py-0.5 transition-colors ${
            activeTag === tag
              ? "text-accent"
              : "text-secondary hover:text-foreground"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
