type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
  type?: "text" | "number" | "email" | "url" | "tel";
  placeholder?: string;
  hint?: string;
  /** When set, renders a select of preset values instead of free text. */
  options?: { value: string; label: string }[];
};

const inputClass =
  "w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-[0.9375rem] outline-none placeholder:text-foreground/30 focus:border-terracotta";

export default function Field({
  label,
  name,
  defaultValue = "",
  textarea,
  rows = 4,
  type = "text",
  placeholder,
  hint,
  options,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted">
        {label}
      </span>
      {options ? (
        <select name={name} defaultValue={defaultValue} className={inputClass}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea name={name} rows={rows} defaultValue={defaultValue} placeholder={placeholder} className={`${inputClass} leading-7`} />
      ) : (
        <input type={type} name={name} defaultValue={defaultValue} placeholder={placeholder} className={inputClass} />
      )}
      {hint ? <span className="text-xs leading-5 text-muted">{hint}</span> : null}
    </label>
  );
}
