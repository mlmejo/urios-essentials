import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function PrimaryButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={twMerge(
        "bg-cornflower-blue-500 hover:bg-cornflower-blue-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white transition duration-150 ease-in-out",
        className,
      )}
    >
      {children}
    </button>
  );
}
