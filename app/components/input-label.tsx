import { LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function InputLabel({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={twMerge("block text-sm font-medium text-gray-700", className)}
    >
      {children}
    </label>
  );
}
