export async function login(identifier: string, password: string) {
  let response = await fetch("http://localhost:1337/api/auth/local", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier: identifier, password: password }),
  });

  let result = await response.json();

  if (!response.ok) {
    throw new Error(result.error.message);
  }

  return result;
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
