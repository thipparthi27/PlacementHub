import { SearchX } from "lucide-react";

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  text,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-7 w-7" />
      </div>

      <h2 className="text-lg font-bold text-ink">{title}</h2>

      {text && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          {text}
        </p>
      )}
    </div>
  );
}