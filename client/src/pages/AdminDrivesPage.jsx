import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Plus, Trash2, Briefcase } from "lucide-react";
import {
  useGetDrivesQuery,
  useDeleteDriveMutation,
} from "../features/drives/drivesApi";
import { formatDate, isPast } from "../utils/formatDate";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ErrorMessage from "../components/ErrorMessage";

export default function AdminDrivesPage() {
  const { data, isLoading, isError } = useGetDrivesQuery({
    sort: "newest",
    limit: 50,
  });

  const [deleteDrive, { isLoading: deleting }] = useDeleteDriveMutation();
  const [toDelete, setToDelete] = useState(null);

  const confirmDelete = async () => {
    try {
      await deleteDrive(toDelete._id).unwrap();
      toast.success("Drive deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err.data?.message || "Could not delete drive");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage drives</h1>
          {data && (
            <p className="text-sm text-muted">{data.total} drives</p>
          )}
        </div>

        <Link
          to="/admin/drives/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={16} /> New drive
        </Link>
      </div>

      {isLoading && (
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-20" />
          ))}
        </div>
      )}

      {isError && <ErrorMessage message="Could not load drives." />}

      {data && data.drives.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No drives yet"
          text="Create the first placement drive."
        />
      )}

      {data && data.drives.length > 0 && (
        <div className="mt-6 space-y-3">
          {data.drives.map((drive) => (
            <Card
              key={drive._id}
              className="flex items-center justify-between gap-3 !p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{drive.company}</p>

                  {isPast(drive.deadline) ? (
                    <Badge tone="gray">Closed</Badge>
                  ) : (
                    <Badge tone="green">Open</Badge>
                  )}
                </div>

                <p className="truncate text-sm text-muted">
                  {drive.role} · Apply by {formatDate(drive.deadline)}
                </p>
              </div>

              <div className="flex shrink-0 gap-1">
                <Link
                  to={`/admin/drives/${drive._id}/edit`}
                  aria-label={`Edit ${drive.company}`}
                  className="rounded-lg p-2 text-muted hover:bg-gray-100"
                >
                  <Pencil size={18} />
                </Link>

                <button
                  onClick={() => setToDelete(drive)}
                  aria-label={`Delete ${drive.company}`}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete ${toDelete?.company}?`}
        text="Deleting this drive will also permanently delete all student applications associated with it. This action cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}