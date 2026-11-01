
import { SearchX } from "lucide-react";

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  text,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-8 w-8" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-ink">
        {title}
      </h2>

      {text && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          {text}
        </p>
      )}
    </div>
  );
}
