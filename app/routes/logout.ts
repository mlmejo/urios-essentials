import { redirectWithClearedCookies } from "~/auth/auth";

export function action() {
  return redirectWithClearedCookies();
}
