import { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import { inputClass } from "../../constants/styles";

export default function TagInput({ id, tags, onChange, placeholder }) {
  const [value, setValue] = useState("");

  const add = () => {
    const tag = value.trim().toLowerCase();

    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }

    setValue("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className={inputClass}
        />

        <Button type="button" variant="secondary" onClick={add}>
          Add
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700"
          >
            {tag}

            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}