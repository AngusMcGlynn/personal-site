import { build } from "velite";

// Build velite content before Next.js starts
const isDev = process.env.NODE_ENV === "development";
await build({ watch: isDev, clean: !isDev });

import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: resolve(__dirname),
  },
};

export default nextConfig;
