import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import DrivesPage from "./pages/DrivesPage";
import DriveDetailPage from "./pages/DriveDetailPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}