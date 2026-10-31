import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetDriveQuery } from "../features/drives/drivesApi";
import { checkEligibility } from "../utils/eligibility";
import { formatDate, isPast } from "../utils/formatDate";
import EligibilityBadge from "../features/drives/EligibilityBadge";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function DriveDetailPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { data: drive, isLoading, isError, error } = useGetDriveQuery(id);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <ErrorMessage
        message={error.status === 404 ? "Drive not found" : "Could not load this drive"}
      />
    );
  }

  const result =
    user.role === "student" ? checkEligibility(user, drive) : null;

  const closed = isPast(drive.deadline);
  const rules = drive.eligibility || {};

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/drives" className="text-sm text-indigo-700 underline">
        &larr; Back to drives
      </Link>

      <div className="mt-4 rounded-lg bg-white p-6 shadow">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{drive.company}</h1>
            <p className="text-gray-600">{drive.role}</p>
          </div>

          {closed && (
            <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium">
              Closed
            </span>
          )}
        </div>

        {drive.description && (
          <p className="mt-4">{drive.description}</p>
        )}

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Package</dt>
            <dd>{drive.package ? `${drive.package} LPA` : "Not announced"}</dd>
          </div>

          <div>
            <dt className="text-gray-500">Location</dt>
            <dd>{drive.location || "Not announced"}</dd>
          </div>

          <div>
            <dt className="text-gray-500">Apply by</dt>
            <dd>{formatDate(drive.deadline)}</dd>
          </div>

          <div>
            <dt className="text-gray-500">Drive date</dt>
            <dd>{formatDate(drive.driveDate)}</dd>
          </div>
        </dl>

        <h2 className="mt-6 font-semibold">Required skills</h2>

        <div className="mt-2 flex flex-wrap gap-1">
          {drive.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="rounded bg-indigo-50 px-2 py-0.5 text-sm text-indigo-700"
            >
              {skill}
            </span>
          ))}
        </div>

        <h2 className="mt-6 font-semibold">Eligibility rules</h2>

        <ul className="mt-2 list-inside list-disc text-sm">
          <li>Minimum CGPA: {rules.minCgpa ?? 0}</li>

          <li>
            Branches:{" "}
            {rules.allowedBranches?.length
              ? rules.allowedBranches.join(", ")
              : "All branches"}
          </li>

          <li>Maximum backlogs: {rules.maxBacklogs ?? 0}</li>
        </ul>

        {result && (
          <div className="mt-6 rounded border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Your eligibility</h2>
              <EligibilityBadge result={result} />
            </div>

            {result.reasons.length > 0 && (
              <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
                {result.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {drive.applyLink && (
          <a
            href={drive.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-indigo-700 underline"
          >
            Official company link
          </a>
        )}
      </div>
    </div>
  );
}