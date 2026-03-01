import Link from "next/link";

export function Header() {
  return (
    <header className="mb-16">
      <Link
        href="/"
        className="text-sm text-secondary hover:text-heading transition-colors"
      >
        &larr; graph
      </Link>
    </header>
  );
}
