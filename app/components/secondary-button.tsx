import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function SecondaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={twMerge("btn-secondary", className)}
    >
      {children}
    </button>
  );
}
