/**
 * Creates or updates the Plantify super-admin user (requires Service Role key).
 *
 * Email: admin@plantify.me  (sign in with this address in the app)
 * Password: Plantify11!
 *
 * Usage (from project root):
 *   1. In Supabase → Project Settings → API, copy the service_role key (keep secret).
 *   2. Add to .env.local:
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...
 *   3. Run: npm run seed:admin
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, "utf8").split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

loadEnv();

const EMAIL = "admin@plantify.me";
const PASSWORD = "Plantify11!";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listData, error: listErr } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listErr) throw listErr;

  const existing = listData.users.find(
    (u) => u.email?.toLowerCase() === EMAIL.toLowerCase()
  );

  let userId;

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Super Admin" },
    });
    if (error) throw error;
    userId = existing.id;
    console.log("Updated existing user:", EMAIL);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Super Admin" },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("Created user:", EMAIL);
  }

  const { error: pErr } = await supabase
    .from("profiles")
    .update({ role: "admin", full_name: "Super Admin" })
    .eq("id", userId);

  if (pErr) {
    console.error("Could not set admin role on profiles:", pErr.message);
    console.error(
      "Ensure migration 003 ran (profiles.role). You can still run:\n" +
        `  update public.profiles set role = 'admin' where id = '${userId}';`
    );
    process.exit(1);
  }

  console.log("\nDone. Sign in at your app with:");
  console.log("  Email:   ", EMAIL);
  console.log("  Password:", PASSWORD);
  console.log("Then open /admin\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
