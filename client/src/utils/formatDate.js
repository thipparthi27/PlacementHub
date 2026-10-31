export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not announced";

export const isPast = (value) => Boolean(value) && new Date(value) < new Date();