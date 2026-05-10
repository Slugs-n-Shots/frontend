import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(".env");
const examplePath = resolve(".env.example");

if (existsSync(envPath)) {
  console.log("postinstall: .env already exists, leaving it unchanged.");
} else if (existsSync(examplePath)) {
  copyFileSync(examplePath, envPath);
  console.log("postinstall: created .env from .env.example.");
} else {
  console.warn("postinstall: .env.example not found, skipping .env creation.");
}
