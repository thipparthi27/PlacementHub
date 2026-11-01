import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Bookmark, Send, Trash2 } from "lucide-react";
import {
  useGetMyApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} from "./applicationsApi";
import { checkEligibility } from "../../utils/eligibility";
import { isPast } from "../../utils/formatDate";
import { STATUSES, STATUS_LABELS, STATUS_TONES } from "../../constants/statuses";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";

export default function ApplicationActions({ drive }) {
  const user = useSelector((state) => state.auth.user);
  const { data: applications = [], isLoading } = useGetMyApplicationsQuery();
  const [createApplication, { isLoading: creating }] = useCreateApplicationMutation();
  const [updateApplication, { isLoading: updating }] = useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  if (isLoading) return null;

  const application = applications.find((a) => a.drive._id === drive._id);
  const closed = isPast(drive.deadline);
  const notEligible = checkEligibility(user, drive).eligible === false;

  const run = async (request, message) => {
    try {
      await request.unwrap();
      toast.success(message);
    } catch (err) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  if (!application) {
    const cannotApply = closed || notEligible;
    return (
      <Card className="mt-4">
        <h2 className="font-semibold">Track this drive</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            loading={creating}
            onClick={() => run(createApplication({ driveId: drive._id, status: "saved" }), "Drive saved")}
          >
            <Bookmark size={16} /> Save
          </Button>
          <Button
            disabled={cannotApply}
            loading={creating}
            onClick={() => run(createApplication({ driveId: drive._id, status: "applied" }), "Marked as applied")}
          >
            <Send size={16} /> I have applied
          </Button>
        </div>
        {closed && <p className="mt-2 text-sm text-muted">The deadline has passed, so you can only save this drive.</p>}
        {!closed && notEligible && (
          <p className="mt-2 text-sm text-muted">You are not eligible for this drive, so applying is disabled.</p>
        )}
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Your application</h2>
        <Badge tone={STATUS_TONES[application.status]}>{STATUS_LABELS[application.status]}</Badge>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <select
          value={application.status}
          disabled={updating}
          onChange={(e) =>
            run(updateApplication({ id: application._id, status: e.target.value }), "Status updated")
          }
          className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <Button
          variant="danger"
          aria-label="Remove from my list"
          onClick={() => run(deleteApplication(application._id), "Removed from your list")}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}