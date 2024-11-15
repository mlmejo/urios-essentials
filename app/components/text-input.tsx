import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function TextInput({
  type = "text",
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      {...props}
      className={twMerge(
        "focus:ring-cornflower-blue-500 focus:border-cornflower-blue-500 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm",
        className,
      )}
    />
  );
}
