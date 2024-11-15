import { twMerge } from "tailwind-merge";

export default function InputError({
  messages,
  className,
}: {
  messages?: string[];
  className?: string;
}) {
  if (!messages) return;

  return messages.map((message) => (
    <p className={twMerge("text-sm text-red-600", className)}>{message}</p>
  ));
}
