import { createContext, useContext, useId } from "react";

const RadioGroupContext = createContext(null);

export function RadioGroup({ value, onValueChange, className = "", children }) {
  const groupName = useId();

  return (
    <RadioGroupContext.Provider
      value={{ name: groupName, value: String(value), onValueChange }}
    >
      <div className={className}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className = "" }) {
  const ctx = useContext(RadioGroupContext);
  const checked = ctx?.value === String(value);

  return (
    <input
      id={id}
      type="radio"
      name={ctx?.name}
      className={`form-check-input ${className}`.trim()}
      value={value}
      checked={checked}
      onChange={(e) => ctx?.onValueChange?.(e.target.value)}
    />
  );
}
