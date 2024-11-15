import { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function TextArea({
  className,
  children,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={twMerge(
        "focus:ring-cornflower-blue-500 focus:border-cornflower-blue-500 rounded-md border-gray-300 bg-white text-gray-900 shadow-sm",
        className,
      )}
    >
      {children}
    </textarea>
  );
}
