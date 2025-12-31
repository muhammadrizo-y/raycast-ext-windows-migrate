export const IGNORED_DIRECTORIES = [
    "node_modules",
    "dist",
    "build",
    ".git",
    "coverage",
] as const;

export const APPLE_SCRIPT_KEYWORDS = [
    /applescript/i,
    /osascript/i,
    /runAppleScript/i,
] as const;

export const MAC_COMMAND_KEYWORDS = [
    /\/usr\/sbin\//i,
    /\/System\/Library\//i,
    /screencapture\s+/i,
] as const;

export const SUPPORTED_FILE_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
] as const;

export const OLD_ESLINT_CONFIG_FILES = [
    "eslint.config.js",
    ".eslintrc.json",
] as const;

export const NEW_ESLINT_CONFIG_CONTENT = `import { defineConfig } from "eslint/config";
import raycastConfig from "@raycast/eslint-config";

export default defineConfig([...raycastConfig]);
`;
