import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate, isPast } from "../../utils/formatDate";
import { checkEligibility } from "../../utils/eligibility";
import EligibilityBadge from "./EligibilityBadge";

export default function DriveCard({ drive }) {
  const user = useSelector((state) => state.auth.user);
  const result = user.role === "student" ? checkEligibility(user, drive) : null;
  const closed = isPast(drive.deadline);

  return (
    <Link
      to={`/drives/${drive._id}`}
      className="block rounded-lg bg-white p-5 shadow transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{drive.company}</h2>
          <p className="text-sm text-gray-600">{drive.role}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <EligibilityBadge result={result} />

          {closed && (
            <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
              Closed
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm">
        {drive.package ? `${drive.package} LPA` : "Package not announced"}
        {drive.location ? ` · ${drive.location}` : ""}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Apply by {formatDate(drive.deadline)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {drive.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </Link>
  );
}