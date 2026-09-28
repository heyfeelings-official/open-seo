import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "drizzle-kit";

// @every-app/sdk 0.2 dropped the Cloudflare helper. Wrangler persists the
// local D1 sqlite file under `.wrangler/state`; pick the newest one.
function getLocalD1Url(): string | undefined {
  const root = ".wrangler/state/v3/d1";
  if (!existsSync(root)) return undefined;
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith(".sqlite")) files.push(path);
    }
  };
  walk(root);
  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return files[0];
}

const localUrl = getLocalD1Url();

export default defineConfig({
  dialect: "sqlite",
  // The raw SQLite barrel (not ../schema, the provider-aware one, which imports
  // cloudflare:workers and can't load under drizzle-kit's node runtime).
  schema: "./src/db/d1/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: localUrl || "", // Empty fallback for CI/non-dev environments
  },
});
