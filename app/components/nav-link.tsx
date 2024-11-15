import { LinkProps, NavLink as _NavLink } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

export default function NavLink({ className, children, ...props }: LinkProps) {
  return (
    <_NavLink
      {...props}
      className={({ isActive }) =>
        twMerge(
          "text-sm font-medium text-white",
          isActive
            ? "underline underline-offset-4"
            : "transition duration-150 ease-in-out hover:underline hover:underline-offset-4",
          className,
        )
      }
    >
      {children}
    </_NavLink>
  );
}
