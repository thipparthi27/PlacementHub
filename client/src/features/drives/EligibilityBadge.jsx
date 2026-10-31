export default function EligibilityBadge({ result }) {
  if (!result) return null;

  if (result.eligible === null) {
    return (
      <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
        Complete profile
      </span>
    );
  }

  return result.eligible ? (
    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
      Eligible
    </span>
  ) : (
    <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
      Not eligible
    </span>
  );
}