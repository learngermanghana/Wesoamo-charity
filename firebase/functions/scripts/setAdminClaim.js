#!/usr/bin/env node
const admin = require("firebase-admin");

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = value;
    i += 1;
  }

  return args;
}

function printUsage() {
  console.log(`Usage:\n  node firebase/functions/scripts/setAdminClaim.js --email <user@email.com> [--remove]\n  node firebase/functions/scripts/setAdminClaim.js --uid <firebase-uid> [--remove]\n\nOptions:\n  --email   User email to look up in Firebase Auth\n  --uid     Firebase Auth UID\n  --remove  Remove admin claim instead of setting it\n\nNotes:\n  - Requires GOOGLE_APPLICATION_CREDENTIALS to point to a service account JSON key.\n  - Sets { admin: true, role: "admin" } by default.`);
}

async function resolveUid(auth, args) {
  if (args.uid) return args.uid;
  if (!args.email) {
    throw new Error("Pass either --uid or --email.");
  }

  const user = await auth.getUserByEmail(args.email);
  return user.uid;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printUsage();
    return;
  }

  admin.initializeApp();
  const auth = admin.auth();
  const uid = await resolveUid(auth, args);

  const user = await auth.getUser(uid);
  const currentClaims = user.customClaims || {};

  let nextClaims;
  if (args.remove) {
    const { admin: _adminClaim, role: _roleClaim, ...rest } = currentClaims;
    nextClaims = rest;
  } else {
    nextClaims = { ...currentClaims, admin: true, role: "admin" };
  }

  await auth.setCustomUserClaims(uid, nextClaims);

  console.log(`Updated claims for ${uid}:`, nextClaims);
  console.log("Done. Ask the user to sign out and sign back in so a fresh ID token is issued.");
}

main().catch((error) => {
  console.error("Failed to update admin claim:", error.message);
  process.exitCode = 1;
});
