import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import DrivesPage from "./pages/DrivesPage";
import DriveDetailPage from "./pages/DriveDetailPage";
import { Toaster } from "react-hot-toast";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDrivesPage from "./pages/AdminDrivesPage";
import AdminDriveFormPage from "./pages/AdminDriveFormPage";

export default function App() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Toaster position="top-right" />

      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<Navigate to="/drives" replace />}
          />
          <Route path="/drives" element={<DrivesPage />} />
          <Route path="/drives/:id" element={<DriveDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute role="student" />}>
          <Route
            path="/applications"
            element={<ApplicationsPage />}
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/drives" element={<AdminDrivesPage />} />
          <Route path="/admin/drives/new" element={<AdminDriveFormPage />} />
          <Route 
            path="/admin/drives/:id/edit"
            element={<AdminDriveFormPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
