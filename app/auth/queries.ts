import fetchFromStrapi from "~/strapi/fetch-wrapper.server";
import { AuthData, User } from "./types";

export async function login(identifier: string, password: string) {
  let loginResponse = await fetchFromStrapi<AuthData>("/api/auth/local", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!loginResponse.success) {
    throw new Error(loginResponse.error || "Login failed");
  }

  let userDataResponse = await fetchFromStrapi<User>(
    "/api/users/me?populate=role",
    {
      headers: {
        Authorization: `Bearer ${loginResponse.data!.jwt}`,
      },
    },
  );

  if (!userDataResponse.success) {
    throw new Error(userDataResponse.error || "User data retrieval failed");
  }

  return {
    jwt: loginResponse.data!.jwt,
    user: userDataResponse.data,
  } as AuthData;
}

export async function register(identifier: string, password: string) {
  let response = await fetch("http://localhost:1337/api/auth/local/register", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: identifier,
      email: identifier,
      password: password,
    }),
  });

  let result = await response.json();

  if (!response.ok) {
    throw new Error(result.error.message);
  }

  return result;
}
