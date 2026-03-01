"use client";

import { deleteEntryAction } from "@/lib/actions/admin";

export function DeleteButton({ path, sha }: { path: string; sha: string }) {
  return (
    <form
      action={deleteEntryAction}
      onSubmit={(e) => {
        if (!confirm("Delete this entry? This commits a deletion to GitHub.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="path" value={path} />
      <input type="hidden" name="sha" value={sha} />
      <button
        type="submit"
        className="text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        Delete
      </button>
    </form>
  );
}
