export default function ErrorMessage({ message }) {
  return (
    <p className="mx-auto mt-10 max-w-md rounded bg-red-50 p-4 text-center text-red-700">
      {message}
    </p>
  );
}