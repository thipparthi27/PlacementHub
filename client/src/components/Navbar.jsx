import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-indigo-700 px-6 py-3 text-white">
      <Link to="/" className="text-lg font-bold">PlacementHub</Link>
      {user ? (
        <div className="flex items-center gap-4">
          <Link to="/drives" className="text-sm hover:underline">
            Drives
          </Link>
          <span className="text-sm">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="rounded bg-white px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4 text-sm">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      )}
    </nav>
  );
}