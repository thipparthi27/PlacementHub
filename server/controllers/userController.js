import { publicUser } from "./authcontroller.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, branch, cgpa, backlogs, skills } = req.body;
    const user = req.user;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = String(name).trim();
    }

    if (branch !== undefined) {
      user.branch = String(branch).trim();
    }

    if (cgpa !== undefined) {
      const n = cgpa === "" ? NaN : Number(cgpa);

      if (Number.isNaN(n) || n < 0 || n > 10) {
        return res.status(400).json({
          message: "CGPA must be between 0 and 10",
        });
      }

      user.cgpa = n;
    }

    if (backlogs !== undefined) {
      const n = backlogs === "" ? NaN : Number(backlogs);

      if (!Number.isInteger(n) || n < 0) {
        return res.status(400).json({
          message: "Backlogs must be a whole number, 0 or more",
        });
      }

      user.backlogs = n;
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          message: "Skills must be a list",
        });
      }

      user.skills = [
        ...new Set(
          skills
            .map((s) => String(s).trim().toLowerCase())
            .filter(Boolean)
        ),
      ].slice(0, 40);
    }

    await user.save();

    res.json({ user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};