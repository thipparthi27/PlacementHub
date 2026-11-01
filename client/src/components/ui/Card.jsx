export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}