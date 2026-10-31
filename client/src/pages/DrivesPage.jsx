import { useState } from "react";
import { useGetDrivesQuery } from "../features/drives/drivesApi";
import DriveCard from "../features/drives/DriveCard";
import useDebounce from "../hooks/useDebounce";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { BRANCHES } from "../constants/branches";

export default function DrivesPage() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [minPackage, setMinPackage] = useState("");
  const [upcoming, setUpcoming] = useState(false);
  const [sort, setSort] = useState("deadline");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search.trim(), 400);

  const params = {
    search: debouncedSearch || undefined,
    branch: branch || undefined,
    minPackage: minPackage || undefined,
    upcoming: upcoming ? "true" : undefined,
    sort,
    page,
    limit: 9,
  };

  const { data, isLoading, isFetching, isError } =
    useGetDrivesQuery(params);

  const onChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const inputClass =
    "rounded border border-gray-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Placement drives</h1>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          placeholder="Search company or role"
          value={search}
          onChange={onChange(setSearch)}
          className={`${inputClass} lg:col-span-2`}
        />

        <select
          value={branch}
          onChange={onChange(setBranch)}
          className={inputClass}
        >
          <option value="">All branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={minPackage}
          onChange={onChange(setMinPackage)}
          className={inputClass}
        >
          <option value="">Any package</option>
          <option value="3">3+ LPA</option>
          <option value="5">5+ LPA</option>
          <option value="8">8+ LPA</option>
          <option value="10">10+ LPA</option>
        </select>

        <select
          value={sort}
          onChange={onChange(setSort)}
          className={inputClass}
        >
          <option value="deadline">Sort: Deadline</option>
          <option value="package">Sort: Package</option>
          <option value="newest">Sort: Newest</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={upcoming}
            onChange={(e) => {
              setUpcoming(e.target.checked);
              setPage(1);
            }}
          />
          Only open drives
        </label>
      </div>

      {isLoading && <Loader />}

      {isError && (
        <ErrorMessage message="Could not load drives. Is the server running?" />
      )}

      {data && (
        <>
          {data.drives.length === 0 ? (
            <p className="mt-10 text-center text-gray-500">
              No drives match your filters.
            </p>
          ) : (
            <div
              className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {data.drives.map((drive) => (
                <DriveCard key={drive._id} drive={drive} />
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="rounded bg-white px-4 py-2 text-sm shadow disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {data.page} of {data.pages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pages}
                className="rounded bg-white px-4 py-2 text-sm shadow disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}