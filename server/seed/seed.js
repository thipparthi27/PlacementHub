import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Drive from "../models/Drive.js";

dotenv.config();

const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const drives = [
  {
    company: "Nimbus Labs", role: "Frontend Developer", package: 6, location: "Hyderabad",
    description: "Build responsive web interfaces with React.",
    requiredSkills: ["react", "javascript", "html", "css"],
    eligibility: { minCgpa: 7, allowedBranches: ["AIML", "CSE", "IT"], maxBacklogs: 0 },
    deadline: daysFromNow(5), driveDate: daysFromNow(10), applyLink: "https://example.com/nimbus",
  },
  {
    company: "DataForge Analytics", role: "Data Analyst Trainee", package: 4.5, location: "Bengaluru",
    description: "Clean, analyse and visualise business data.",
    requiredSkills: ["python", "sql", "pandas", "excel"],
    eligibility: { minCgpa: 6.5, allowedBranches: ["AIML", "CSE", "IT", "ECE"], maxBacklogs: 1 },
    deadline: daysFromNow(8), driveDate: daysFromNow(14), applyLink: "https://example.com/dataforge",
  },
  {
    company: "CloudNest Systems", role: "Backend Engineer", package: 8, location: "Pune",
    description: "Design REST APIs and work with databases.",
    requiredSkills: ["node.js", "express", "mongodb", "javascript"],
    eligibility: { minCgpa: 7.5, allowedBranches: ["AIML", "CSE", "IT"], maxBacklogs: 0 },
    deadline: daysFromNow(12), driveDate: daysFromNow(18), applyLink: "https://example.com/cloudnest",
  },
  {
    company: "PixelCraft Studio", role: "UI Developer Intern", package: 3.6, location: "Remote",
    description: "Turn Figma designs into clean React components.",
    requiredSkills: ["react", "css", "javascript", "git"],
    eligibility: { minCgpa: 6, allowedBranches: [], maxBacklogs: 2 },
    deadline: daysFromNow(3), driveDate: daysFromNow(7), applyLink: "https://example.com/pixelcraft",
  },
  {
    company: "Vertex AI Works", role: "Machine Learning Engineer", package: 10, location: "Bengaluru",
    description: "Train and deploy machine learning models.",
    requiredSkills: ["python", "scikit-learn", "numpy", "sql"],
    eligibility: { minCgpa: 8, allowedBranches: ["AIML", "CSE"], maxBacklogs: 0 },
    deadline: daysFromNow(15), driveDate: daysFromNow(22), applyLink: "https://example.com/vertex",
  },
  {
    company: "Orbit Software", role: "Full Stack Developer", package: 7, location: "Chennai",
    description: "Work across React front ends and Node back ends.",
    requiredSkills: ["react", "node.js", "mongodb", "git"],
    eligibility: { minCgpa: 7, allowedBranches: ["AIML", "CSE", "IT", "ECE"], maxBacklogs: 1 },
    deadline: daysFromNow(20), driveDate: daysFromNow(26), applyLink: "https://example.com/orbit",
  },
  {
    company: "Greenline Tech", role: "QA Engineer", package: 4, location: "Visakhapatnam",
    description: "Test web applications and write test cases.",
    requiredSkills: ["javascript", "sql", "testing"],
    eligibility: { minCgpa: 6, allowedBranches: [], maxBacklogs: 2 },
    deadline: daysFromNow(-4), driveDate: daysFromNow(-1), applyLink: "https://example.com/greenline",
  },
  {
    company: "Helix Solutions", role: "Software Engineer Trainee", package: 5, location: "Hyderabad",
    description: "Join a training programme and rotate across teams.",
    requiredSkills: ["java", "sql", "aptitude"],
    eligibility: { minCgpa: 6.5, allowedBranches: ["CSE", "IT", "ECE", "EEE"], maxBacklogs: 0 },
    deadline: daysFromNow(10), driveDate: daysFromNow(16), applyLink: "https://example.com/helix",
  },
];

const run = async () => {
  await connectDB();

  // demo accounts (created only if they do not exist)
  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("student123", 10);

  const admin = await User.findOneAndUpdate(
    { email: "admin@placementhub.com" },
    { name: "Placement Coordinator", passwordHash: adminHash, role: "admin" },
    { upsert: true, new: true }
  );
  await User.findOneAndUpdate(
    { email: "student@placementhub.com" },
    {
      name: "Demo Student", passwordHash: studentHash, role: "student",
      branch: "AIML", cgpa: 8.08, backlogs: 0,
      skills: ["python", "html", "css", "javascript"],
    },
    { upsert: true, new: true }
  );

  // replace all drives with fresh demo drives
  await Drive.deleteMany({});
  await Drive.insertMany(drives.map((d) => ({ ...d, createdBy: admin._id })));

  console.log(`Seeded ${drives.length} drives and 2 demo accounts`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});