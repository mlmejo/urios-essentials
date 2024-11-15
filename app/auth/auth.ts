import { createCookie, redirect } from "@remix-run/node";
import { StrapiUser } from "~/types";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
  );
  secret = "default-secret";
}

let cookie = createCookie("auth", {
  secrets: [secret],
  // 30 days
  maxAge: 30 * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export async function getAuthFromRequest(
  request: Request,
): Promise<StrapiUser | null> {
  let userData = await cookie.parse(request.headers.get("Cookie"));
  return userData ?? null;
}

export async function requireAuthCookie(request: Request) {
  let userData = await getAuthFromRequest(request);
  if (!userData) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await cookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
  return userData;
}

export async function setAuthOnResponse(
  response: Response,
  userData: StrapiUser,
): Promise<Response> {
  let header = await cookie.serialize(userData);
  response.headers.append("Set-Cookie", header);
  return response;
}

export async function redirectWithClearedCookies() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize(null, {
        expires: new Date(0),
      }),
    },
  });
}
