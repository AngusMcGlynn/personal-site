"use client";

import { useActionState } from "react";
import type { FieldDef } from "@/lib/admin/mdx";
import type { ContentType } from "@/lib/admin/github";

interface Props {
  type: ContentType;
  fields: FieldDef[];
  action: (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  initialValues?: Record<string, string>;
  initialBody?: string;
  hiddenFields?: Record<string, string>;
}

export function ContentForm({
  type,
  fields,
  action,
  initialValues = {},
  initialBody = "",
  hiddenFields = {},
}: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-2xl">
      {state.error && (
        <p className="text-red-400 text-sm">{state.error}</p>
      )}

      <input type="hidden" name="_type" value={type} />
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={field.name} className="text-sm text-secondary">
            {field.label}
            {field.required && <span className="text-accent ml-1">*</span>}
          </label>

          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialValues[field.name] || ""}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-foreground focus:outline-none focus:border-accent"
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue={initialValues[field.name] || ""}
              placeholder={field.placeholder}
              rows={3}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-foreground placeholder:text-secondary focus:outline-none focus:border-accent resize-y"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type === "date" ? "date" : "text"}
              required={field.required}
              defaultValue={initialValues[field.name] || ""}
              placeholder={field.placeholder}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-foreground placeholder:text-secondary focus:outline-none focus:border-accent"
            />
          )}
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label htmlFor="_body" className="text-sm text-secondary">
          Body (MDX)
        </label>
        <textarea
          id="_body"
          name="_body"
          defaultValue={initialBody}
          rows={12}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-foreground font-mono text-sm placeholder:text-secondary focus:outline-none focus:border-accent resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-accent text-bg font-medium rounded px-3 py-2 hover:opacity-90 disabled:opacity-50 transition-opacity w-fit"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
