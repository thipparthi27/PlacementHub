import { useSelector } from "react-redux";

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="mx-auto mt-10 max-w-3xl px-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p className="mt-2 text-gray-600">
        You are logged in as a {user.role}. Drives will show up here soon.
      </p>
    </div>
  );
}