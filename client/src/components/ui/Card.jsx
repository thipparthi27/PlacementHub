
export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
