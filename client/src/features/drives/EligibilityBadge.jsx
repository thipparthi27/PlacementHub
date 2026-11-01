import Badge from "../../components/ui/Badge";

export default function EligibilityBadge({ result }) {
  if (!result) return null;

  if (result.eligible === null) {
    return <Badge tone="gray">Complete profile</Badge>;
  }

  return result.eligible ? (
    <Badge tone="green">Eligible</Badge>
  ) : (
    <Badge tone="red">Not eligible</Badge>
  );
}