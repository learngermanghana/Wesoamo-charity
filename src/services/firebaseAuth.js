import { buildFirebaseAuthUrl } from "../config/firebase";

async function callAuthEndpoint(path, body) {
  const response = await fetch(buildFirebaseAuthUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    const rawMessage = data?.error?.message || "";
    const normalizedMessage = rawMessage.replaceAll("_", " ").toLowerCase();

    if (normalizedMessage.includes("invalid login credentials") || normalizedMessage.includes("invalid password")) {
      throw new Error("Invalid email or password.");
    }

    if (normalizedMessage.includes("too many attempts")) {
      throw new Error("Too many attempts. Please wait and try again.");
    }

    if (normalizedMessage.includes("email not found")) {
      throw new Error("No account found for this email.");
    }

    throw new Error(rawMessage.replaceAll("_", " ") || "Authentication failed");
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

export async function sendPasswordResetEmail(email) {
  return callAuthEndpoint("accounts:sendOobCode", {
    requestType: "PASSWORD_RESET",
    email
  });
}
