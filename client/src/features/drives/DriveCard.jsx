import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapPin, CalendarDays, IndianRupee } from "lucide-react";
import { formatDate, isPast } from "../../utils/formatDate";
import { checkEligibility } from "../../utils/eligibility";
import EligibilityBadge from "./EligibilityBadge";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function DriveCard({ drive }) {
  const user = useSelector((state) => state.auth.user);
  const result =
    user?.role === "student" ? checkEligibility(user, drive) : null;
  const closed = isPast(drive.deadline);

  return (
    <Link
      to={`/drives/${drive._id}`}
      className="group block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <Card className="flex h-full flex-col p-5 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-ink transition-colors group-hover:text-brand-700">
              {drive.company}
            </h2>
            <p className="mt-1 text-sm text-muted">{drive.role}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <EligibilityBadge result={result} />

            {closed && <Badge tone="gray">Closed</Badge>}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IndianRupee className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-bold text-ink">
              {drive.package ? `${drive.package} LPA` : "Not announced"}
            </p>
            <p className="text-xs text-muted">Annual package</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
          {drive.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              {drive.location}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0" />
            Deadline: {formatDate(drive.deadline)}
          </span>
        </div>

        {drive.requiredSkills?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {drive.requiredSkills.map((skill) => (
              <Badge key={skill} tone="brand">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
          <span className="text-sm font-semibold text-brand-700">
            View details
          </span>
          <span className="text-brand-600 transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </Card>
    </Link>
  );
}