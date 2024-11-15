import { redirect } from "@remix-run/react";

export async function loader() {
  throw redirect("/admin/auth/login");
}
