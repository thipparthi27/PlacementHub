import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useUpdateProfileMutation } from "../features/profile/profileApi";
import { updateUser } from "../features/auth/authSlice";
import { BRANCHES } from "../constants/branches";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [form, setForm] = useState({
    name: user.name || "",
    branch: user.branch || "",
    cgpa: user.cgpa ?? "",
    backlogs: user.backlogs ?? 0,
  });
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const addSkill = () => {
    const skill = skillInput.trim().toLowerCase();
    if (skill && !skills.includes(skill)) setSkills([...skills, skill]);
    setSkillInput("");
  };

  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  // completeness is based on the SAVED profile, not the form
  const checks = [
    Boolean(user.name),
    Boolean(user.branch),
    typeof user.cgpa === "number",
    (user.skills || []).length > 0,
  ];
  const percent = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfile({
        name: form.name,
        branch: form.branch,
        cgpa: form.cgpa === "" ? undefined : Number(form.cgpa),
        backlogs: Number(form.backlogs),
        skills,
      }).unwrap();
      dispatch(updateUser(data.user));
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err.data?.message || "Could not save profile");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
             Your Profile
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
        Eligibility on every drive is calculated from this information.
      </p>
      
        <Card className="mt-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold">Profile Completeness</h2>
                    <p className="mt-1 text-xs text-muted">
                        Complete your profile to check placement eligibility.
                    </p>
                </div>
                <span className="text-xl font-bold text-brand-600">{percent}%</span>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-brand-600 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </Card>


      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="name">
              Full Name
            </label>
            <input id="name" required value={form.name} onChange={setField("name")} className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="branch">
              Branch
            </label>
            <select id="branch" value={form.branch} onChange={setField("branch")} className={inputClass}>
              <option value="">Select your branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="cgpa">CGPA (0 to 10)</label>
              <input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.cgpa}
                onChange={setField("cgpa")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="backlogs">Active backlogs</label>
              <input
                id="backlogs"
                type="number"
                min="0"
                step="1"
                value={form.backlogs}
                onChange={setField("backlogs")}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="skill">Skills</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                placeholder="Type a skill and press Enter"
                className={inputClass}
              />
              <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-muted">No skills added yet.</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            loading={isLoading}
            className="mt-2 w-full py-3 font-semibold"
          >
            Save profile
          </Button>
        </form>
      </Card>
    </div>
  );
}