import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");

  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password.length < 6) {
      return setFormError("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return setFormError("Passwords do not match");
    }

    try {
      const data = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch {
      // The error message is displayed below.
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-12">
      <Card className="p-6 sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join PlacementHub and explore placement opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-ink"
              htmlFor="name"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-ink"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-ink"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputClass}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-ink"
              htmlFor="confirm"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className={inputClass}
            />
          </div>

          {(formError || error) && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {formError ||
                error?.data?.message ||
                "Could not reach the server"}
            </p>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-700 hover:text-brand-600"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}