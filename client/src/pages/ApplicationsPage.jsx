import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipboardList, Trash2 } from "lucide-react";
import {
  useGetMyApplicationsQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} from "../features/applications/applicationsApi";
import { STATUSES, STATUS_LABELS, STATUS_TONES } from "../constants/statuses";
import { formatDate } from "../utils/formatDate";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ErrorMessage";

function ApplicationCard({ application }) {
  const [updateApplication] = useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();
  const { drive } = application;

  const save = async (changes, message) => {
    try {
      await updateApplication({ id: application._id, ...changes }).unwrap();
      toast.success(message);
    } catch (err) {
      toast.error(err.data?.message || "Could not update");
    }
  };

  const remove = async () => {
    try {
      await deleteApplication(application._id).unwrap();
      toast.success("Removed from your list");
    } catch (err) {
      toast.error(err.data?.message || "Could not remove");
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/drives/${drive._id}`} className="text-lg font-semibold hover:underline">
            {drive.company}
          </Link>
          <p className="text-sm text-muted">{drive.role}</p>
        </div>
        <Badge tone={STATUS_TONES[application.status]}>{STATUS_LABELS[application.status]}</Badge>
      </div>

      <p className="mt-2 text-sm text-muted">Apply by {formatDate(drive.deadline)}</p>

      <select
        value={application.status}
        onChange={(e) => save({ status: e.target.value }, "Status updated")}
        className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      <textarea
        defaultValue={application.notes || ""}
        placeholder="Add a note (saved when you click outside)"
        maxLength={500}
        rows={2}
        onBlur={(e) => {
          if (e.target.value !== (application.notes || "")) {
            save({ notes: e.target.value }, "Note saved");
          }
        }}
        className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />

      <Button variant="ghost" onClick={remove} className="mt-2">
        <Trash2 size={16} /> Remove
      </Button>
    </Card>
  );
}

export default function ApplicationsPage() {
  const [filter, setFilter] = useState("all");
  const { data: applications, isLoading, isError } = useGetMyApplicationsQuery();

  const countOf = (status) => applications.filter((a) => a.status === status).length;
  const visible =
    filter === "all" ? applications : applications?.filter((a) => a.status === filter);

  return (
  <div className="mx-auto max-w-5xl px-4 py-10">
    <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
        My Applications
    </h1>
    <p className="mt-2 text-center text-sm text-muted">
        Track and manage all your placement applications in one place.
    </p>

      {isLoading && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-44" />
          ))}
        </div>
      )}

      {isError && <ErrorMessage message="Could not load your applications." />}

      {applications && (
        <>
          <div className="mt-6 flex flex-wrap justify-center gap-3 pb-2">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${
                  filter === s ? "bg-brand-600 text-white" : "bg-white text-muted shadow-sm"
                }`}
              >
                {s === "all" ? `All (${applications.length})` : `${STATUS_LABELS[s]} (${countOf(s)})`}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={filter === "all" ? "No applications yet" : "Nothing in this stage"}
              text={
                filter === "all"
                  ? "Open a drive and tap Save or I have applied to start tracking."
                  : "Move an application to this stage and it will show up here."
              }
            />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {visible.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}