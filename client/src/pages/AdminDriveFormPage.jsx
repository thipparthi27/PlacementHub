import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetDriveQuery,
  useCreateDriveMutation,
  useUpdateDriveMutation,
} from "../features/drives/drivesApi";
import DriveForm from "../features/admin/DriveForm";
import Skeleton from "../components/ui/Skeleton";
import ErrorMessage from "../components/ErrorMessage";

export default function AdminDriveFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: drive, isLoading, isError } = useGetDriveQuery(id, {
    skip: !isEdit,
  });

  const [createDrive, { isLoading: creating }] = useCreateDriveMutation();
  const [updateDrive, { isLoading: updating }] = useUpdateDriveMutation();

  const handleSubmit = async (payload) => {
    try {
      if (isEdit) {
        await updateDrive({ id, ...payload }).unwrap();
      } else {
        await createDrive(payload).unwrap();
      }

      toast.success(isEdit ? "Drive updated" : "Drive created");
      navigate("/admin/drives");
    } catch (err) {
      toast.error(err.data?.message || "Could not save the drive");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/admin/drives"
        className="text-sm text-brand-700 underline"
      >
        &larr; Back to manage drives
      </Link>

      <h1 className="mb-6 mt-3 text-2xl font-bold">
        {isEdit ? "Edit drive" : "New drive"}
      </h1>

      {isEdit && isLoading && <Skeleton className="h-96" />}

      {isEdit && isError && (
        <ErrorMessage message="Drive not found." />
      )}

      {(!isEdit || drive) && (
        <DriveForm
          key={drive?._id || "new"}
          drive={drive}
          onSubmit={handleSubmit}
          loading={creating || updating}
        />
      )}
    </div>
  );
}