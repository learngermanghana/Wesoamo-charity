import { buildFirebaseAuthUrl, buildFirebaseSecureTokenUrl } from "../config/firebase";

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message?.replaceAll("_", " ") || "Authentication failed";
    throw new Error(message);
  }

  return data;
}

async function callAuthEndpoint(path, body) {
  const response = await fetch(buildFirebaseAuthUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return parseResponse(response);
}

export async function signInAdminWithPassword(email, password) {
  return callAuthEndpoint("accounts:signInWithPassword", {
    email,
    password,
    returnSecureToken: true
  });
}

export async function refreshAdminSession(refreshToken) {
  const response = await fetch(buildFirebaseSecureTokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    }).toString()
  });

  return parseResponse(response);
}
