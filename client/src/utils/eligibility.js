const normalize = (text) => String(text || "").trim().toLowerCase();

// Returns { eligible: true | false | null, reasons: [...] }
// null means "cannot tell yet" because the profile is incomplete
export function checkEligibility(user, drive) {
  const rules = drive.eligibility || {};

  if (typeof user.cgpa !== "number" || !user.branch) {
    return {
      eligible: null,
      reasons: ["Add your branch and CGPA in your profile to check eligibility"],
    };
  }

  const reasons = [];

  const minCgpa = rules.minCgpa ?? 0;
  if (user.cgpa < minCgpa) {
    reasons.push(`CGPA ${user.cgpa} is below the required ${minCgpa}`);
  }

  const allowed = (rules.allowedBranches || []).map(normalize);
  if (allowed.length > 0 && !allowed.includes(normalize(user.branch))) {
    reasons.push(`Branch ${user.branch} is not in the allowed list`);
  }

  const maxBacklogs = rules.maxBacklogs ?? 0;
  const backlogs = user.backlogs ?? 0;
  if (backlogs > maxBacklogs) {
    reasons.push(`${backlogs} backlog(s) is above the limit of ${maxBacklogs}`);
  }

  return { eligible: reasons.length === 0, reasons };
}