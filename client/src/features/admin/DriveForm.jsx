import { useState } from "react";
import { BRANCHES } from "../../constants/branches";
import { inputClass } from "../../constants/styles";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TagInput from "../../components/ui/TagInput";

// YYYY-MM-DD in the viewer's local time, for <input type="date">
const toDateInput = (value) =>
  value ? new Date(value).toLocaleDateString("en-CA") : "";

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function DriveForm({ drive, onSubmit, loading }) {
  const rules = drive?.eligibility || {};

  const [form, setForm] = useState({
    company: drive?.company || "",
    role: drive?.role || "",
    description: drive?.description || "",
    package: drive?.package ?? "",
    location: drive?.location || "",
    applyLink: drive?.applyLink || "",
    deadline: toDateInput(drive?.deadline),
    driveDate: toDateInput(drive?.driveDate),
    minCgpa: rules.minCgpa ?? 0,
    maxBacklogs: rules.maxBacklogs ?? 0,
  });

  const [skills, setSkills] = useState(drive?.requiredSkills || []);
  const [branches, setBranches] = useState(rules.allowedBranches || []);
  const [errors, setErrors] = useState({});

  const setField = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const toggleBranch = (branch) =>
    setBranches(
      branches.includes(branch)
        ? branches.filter((b) => b !== branch)
        : [...branches, branch]
    );

  const validate = () => {
    const e = {};

    if (!form.company.trim()) e.company = "Company name is required";
    if (!form.role.trim()) e.role = "Role is required";

    if (form.package !== "" && Number(form.package) < 0) {
      e.package = "Package cannot be negative";
    }

    const cgpa = Number(form.minCgpa);
    if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      e.minCgpa = "Must be between 0 and 10";
    }

    const backlogs = Number(form.maxBacklogs);
    if (!Number.isInteger(backlogs) || backlogs < 0) {
      e.maxBacklogs = "Must be a whole number, 0 or more";
    }

    if (!form.deadline) e.deadline = "Deadline is required";

    if (form.deadline && form.driveDate && form.driveDate < form.deadline) {
      e.driveDate = "Drive date cannot be before the deadline";
    }

    if (form.applyLink && !/^https?:\/\//i.test(form.applyLink)) {
      e.applyLink = "Link must start with http:// or https://";
    }

    if (skills.length === 0) {
      e.skills = "Add at least one required skill";
    }

    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) return;

    onSubmit({
      company: form.company.trim(),
      role: form.role.trim(),
      description: form.description.trim(),
      package: form.package === "" ? null : Number(form.package),
      location: form.location.trim(),
      applyLink: form.applyLink.trim(),
      requiredSkills: skills,
      eligibility: {
        minCgpa: Number(form.minCgpa),
        allowedBranches: branches,
        maxBacklogs: Number(form.maxBacklogs),
      },
      // deadline closes at the end of the chosen day
      deadline: new Date(`${form.deadline}T23:59:59`).toISOString(),
      driveDate: form.driveDate
        ? new Date(`${form.driveDate}T12:00:00`).toISOString()
        : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="space-y-4">
        <h2 className="text-center text-lg font-semibold tracking-tight">
            Drive Details
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" htmlFor="company" error={errors.company}>
            <input
              id="company"
              value={form.company}
              onChange={setField("company")}
              className={inputClass}
            />
          </Field>

          <Field label="Role" htmlFor="role" error={errors.role}>
            <input
              id="role"
              value={form.role}
              onChange={setField("role")}
              className={inputClass}
            />
          </Field>

          <Field label="Package (LPA)" htmlFor="package" error={errors.package}>
            <input
              id="package"
              type="number"
              min="0"
              step="0.1"
              value={form.package}
              onChange={setField("package")}
              className={inputClass}
            />
          </Field>

          <Field label="Location" htmlFor="location">
            <input
              id="location"
              value={form.location}
              onChange={setField("location")}
              className={inputClass}
            />
          </Field>

          <Field
            label="Apply by (deadline)"
            htmlFor="deadline"
            error={errors.deadline}
          >
            <input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={setField("deadline")}
              className={inputClass}
            />
          </Field>

          <Field
            label="Drive date"
            htmlFor="driveDate"
            error={errors.driveDate}
          >
            <input
              id="driveDate"
              type="date"
              value={form.driveDate}
              onChange={setField("driveDate")}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={setField("description")}
            className={inputClass}
          />
        </Field>

        <Field
          label="Official link"
          htmlFor="applyLink"
          error={errors.applyLink}
        >
          <input
            id="applyLink"
            placeholder="https://..."
            value={form.applyLink}
            onChange={setField("applyLink")}
            className={inputClass}
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-center text-lg font-semibold tracking-tight">
            Required Skills
        </h2>

        <TagInput
          id="skills"
          tags={skills}
          onChange={setSkills}
          placeholder="Type a skill and press Enter"
        />

        {errors.skills && (
          <p className="text-sm text-red-600">{errors.skills}</p>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-center text-lg font-semibold tracking-tight">
            Eligibility Rules
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Minimum CGPA"
            htmlFor="minCgpa"
            error={errors.minCgpa}
          >
            <input
              id="minCgpa"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={form.minCgpa}
              onChange={setField("minCgpa")}
              className={inputClass}
            />
          </Field>

          <Field
            label="Maximum backlogs"
            htmlFor="maxBacklogs"
            error={errors.maxBacklogs}
          >
            <input
              id="maxBacklogs"
              type="number"
              min="0"
              step="1"
              value={form.maxBacklogs}
              onChange={setField("maxBacklogs")}
              className={inputClass}
            />
          </Field>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Allowed branches</p>

          <div className="flex flex-wrap gap-2">
            {BRANCHES.map((branch) => (
              <button
                key={branch}
                type="button"
                onClick={() => toggleBranch(branch)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  branches.includes(branch)
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-muted"
                }`}
              >
                {branch}
              </button>
            ))}
          </div>

          <p className="mt-2 text-sm text-muted">
            If no branches are selected, all branches are eligible.
          </p>
        </div>
      </Card>

      <Button type="submit" loading={loading} className="w-full">
        {drive ? "Save changes" : "Create drive"}
      </Button>
    </form>
  );
}