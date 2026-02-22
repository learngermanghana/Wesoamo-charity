import { buildFirebaseAuthUrl } from "../config/firebase";

async function callAuthEndpoint(path, body) {
  const response = await fetch(buildFirebaseAuthUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message?.replaceAll("_", " ") || "Authentication failed";
    throw new Error(message);
  }

  return data;
}

export async function signInAdminWithPassword(email, password) {
  return callAuthEndpoint("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true
  });
}
