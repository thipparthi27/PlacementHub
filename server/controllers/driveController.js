import Drive from "../models/Drive.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/drives?search=&branch=&minPackage=&upcoming=true&sort=deadline&page=1&limit=9
export const getDrives = async (req, res) => {
  try {
    const { search, branch, minPackage, upcoming, sort = "deadline" } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 9, 50);

    const filter = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ company: regex }, { role: regex }];
    }
    if (branch) {
      // drives that allow this branch, or have no branch restriction
      filter.$and = [
        {
          $or: [
            { "eligibility.allowedBranches": branch },
            { "eligibility.allowedBranches": { $size: 0 } },
          ],
        },
      ];
    }
    if (minPackage) filter.package = { $gte: Number(minPackage) };
    if (upcoming === "true") filter.deadline = { $gte: new Date() };

    const sortOptions = {
      deadline: { deadline: 1 },
      package: { package: -1 },
      newest: { createdAt: -1 },
    };

    const total = await Drive.countDocuments(filter);
    const drives = await Drive.find(filter)
      .sort(sortOptions[sort] || sortOptions.deadline)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ drives, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json(drive);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const createDrive = async (req, res) => {
  try {
    const { company, role } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }
    const drive = await Drive.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json(drive);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json({ message: "Drive deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};