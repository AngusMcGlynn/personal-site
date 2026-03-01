import Link from "next/link";
import { logoutAction } from "@/lib/actions/admin";

const CONTENT_TYPES = [
  { type: "projects", label: "Projects" },
  { type: "log", label: "Log" },
  { type: "library", label: "Library" },
  { type: "principles", label: "Principles" },
  { type: "now", label: "Now" },
] as const;

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-heading font-medium">
            Admin
          </Link>
          <nav className="flex gap-4">
            {CONTENT_TYPES.map(({ type, label }) => (
              <Link
                key={type}
                href={`/admin/${type}/new`}
                className="text-sm text-secondary hover:text-foreground transition-colors"
              >
                + {label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-secondary hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
