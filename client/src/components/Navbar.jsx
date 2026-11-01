
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BriefcaseBusiness,
  ClipboardList,
  UserRound,
  LogOut,
  Settings,
} from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { api } from "../app/api";

const tabs = [
  { to: "/drives", label: "Drives", icon: BriefcaseBusiness },
  { to: "/applications", label: "Applications", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: UserRound },
];
const adminTabs = [
  { to: "/drives", label: "Drives", icon: BriefcaseBusiness },
  { to: "/admin/drives", label: "Manage Drives", icon: Settings },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);

  const visibleTabs =
  user?.role === "admin"
    ? adminTabs
    : user?.role === "student"
      ? tabs
      : [];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700"
        : "text-muted hover:bg-gray-100 hover:text-ink"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/drives" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <span className="text-lg font-bold tracking-tight text-ink">
              PlacementHub
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={linkClass}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:hidden">
        <div
          className={`mx-auto grid max-w-md px-2 py-2 ${
            visibleTabs.length === 1
              ? "grid-cols-1"
              : visibleTabs.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium ${
                    isActive ? "text-brand-700" : "text-muted"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
