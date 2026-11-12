export default function Select({
  label,
  name,
  value,
  error,
  onChange,
  options = [],
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-caption mb-1 text-[var(--semantic-text-primary)]">
          {label}
        </label>
      )}

      <div className="relative h-12 flex items-center">
        <select
          value={value}
          onChange={onChange}
          name={name}
          className={`
            w-full
            h-10
            rounded-md
            border
            border-[var(--color-primary-950)]
            bg-[var(--semantic-background)]
            px-4
            text-body
            text-[var(--semantic-text-primary)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--semantic-brand)]
            ${error ? "border-red-800" : ""}
          `}
        >
          <option value="">Seleccione una opción</option>

          {options.map((option) => {
            const optionValue = option.value ?? option.id;

            return (
              <option key={optionValue} value={optionValue}>
                {option.label}
              </option>
            );
          })}
        </select>
      </div>

      {error && (
        <p className="text-caption text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
