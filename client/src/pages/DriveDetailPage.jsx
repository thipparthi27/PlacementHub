import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ApplicationActions from "../features/applications/ApplicationActions";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  IndianRupee,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Pencil,
} from "lucide-react";
import { useGetDriveQuery } from "../features/drives/drivesApi";
import { checkEligibility } from "../utils/eligibility";
import { formatDate, isPast } from "../utils/formatDate";
import EligibilityBadge from "../features/drives/EligibilityBadge";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function DriveDetailPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { data: drive, isLoading, isError, error } = useGetDriveQuery(id);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorMessage
          message={
            error.status === 404
              ? "Drive not found"
              : "Could not load this drive"
          }
        />
        <Link
          to="/drives"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to drives
        </Link>
      </div>
    );
  }

  const result =
    user?.role === "student" ? checkEligibility(user, drive) : null;

  const closed = isPast(drive.deadline);
  const rules = drive.eligibility || {};

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <Link
          to="/drives"
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to drives
        </Link>

        <Card className="mt-5 overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {drive.company}
                  </h1>
                  <p className="mt-2 text-base text-muted">{drive.role}</p>

                  {drive.location && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {drive.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {closed && <Badge tone="gray">Closed</Badge>}
                
                {user?.role === "admin" && (
                  <Link
                  to={`/admin/drives/${drive._id}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Drive
                    </Link>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            {drive.description && (
              <section>
                <h2 className="text-lg font-bold text-ink">
                  About this opportunity
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
                  {drive.description}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold text-ink">
                Drive overview
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted">
                        Annual package
                      </p>
                      <p className="mt-1 text-lg font-bold text-ink">
                        {drive.package
                          ? `${drive.package} LPA`
                          : "Not announced"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {drive.location || "Not announced"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted">
                        Application deadline
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {formatDate(drive.deadline)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted">
                        Drive date
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {formatDate(drive.driveDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Required skills</h2>

              {drive.requiredSkills?.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {drive.requiredSkills.map((skill) => (
                    <Badge key={skill} tone="brand">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  No specific skills listed.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Eligibility criteria
              </h2>

              <div className="mt-3 space-y-3 rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start gap-3 text-sm">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <p className="text-muted">
                    Minimum CGPA:{" "}
                    <span className="font-semibold text-ink">
                      {rules.minCgpa ?? 0}
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <BriefcaseBusiness className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <p className="text-muted">
                    Eligible branches:{" "}
                    <span className="font-semibold text-ink">
                      {rules.allowedBranches?.length
                        ? rules.allowedBranches.join(", ")
                        : "All branches"}
                    </span>
                  </p>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <p className="text-muted">
                    Maximum backlogs:{" "}
                    <span className="font-semibold text-ink">
                      {rules.maxBacklogs ?? 0}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {result && (
              <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-ink">
                    Your eligibility
                  </h2>
                  <EligibilityBadge result={result} />
                </div>

                {result.reasons?.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {result.reasons.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
            {user?.role === "student" && (
              <ApplicationActions drive={drive} />
              )}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">
                  Interested in this opportunity?
                </p>
                <p className="mt-1 text-sm text-muted">
                  Check the eligibility criteria before applying.
                </p>
              </div>

              {drive.applyLink ? (
                <a
                  href={drive.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  Official company link
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Button variant="secondary" disabled>
                  Application link unavailable
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}