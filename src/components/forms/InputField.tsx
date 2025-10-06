import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export default function InputField({ label, id, className = "", ...rest }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
        {...rest}
      />
    </div>
  );
}
