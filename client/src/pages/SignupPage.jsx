import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";

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
    if (password.length < 6) return setFormError("Password must be at least 6 characters");
    if (password !== confirm) return setFormError("Passwords do not match");

    try {
      const data = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch {
      // The error message is shown below from the hook's `error`.
    }
  };

  const inputClass = "w-full rounded border border-gray-300 px-3 py-2";

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="name">Full name</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        </div>
        {(formError || error) && (
          <p className="text-sm text-red-600">
            {formError || error.data?.message || "Could not reach the server"}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-indigo-700 py-2 font-medium text-white hover:bg-indigo-800 disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already registered? <Link to="/login" className="text-indigo-700 underline">Log in</Link>
      </p>
    </div>
  );
}