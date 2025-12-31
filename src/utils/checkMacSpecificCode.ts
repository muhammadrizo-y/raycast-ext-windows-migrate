import fs from "fs";
import path from "path";
import type { MacSpecificCodeCheckResult } from "../types/index.js";
import {
    IGNORED_DIRECTORIES,
    APPLE_SCRIPT_KEYWORDS,
    MAC_COMMAND_KEYWORDS,
    SUPPORTED_FILE_EXTENSIONS,
} from "../constants/index.js";

function checkFileForAppleScript(filePath: string): boolean {
    try {
        const content = fs.readFileSync(filePath, "utf-8");

        for (const keyword of APPLE_SCRIPT_KEYWORDS) {
            if (keyword.test(content)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error(`Failed to read file: ${filePath}`, errorMessage);
        return false;
    }
}

function checkFileForMacCommands(filePath: string): boolean {
    try {
        const content = fs.readFileSync(filePath, "utf-8");

        for (const keyword of MAC_COMMAND_KEYWORDS) {
            if (keyword.test(content)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error(`Failed to read file: ${filePath}`, errorMessage);
        return false;
    }
}

function scanDirectory(
    dir: string,
    extensions: readonly string[] = SUPPORTED_FILE_EXTENSIONS,
): {
    filesWithAppleScript: string[];
    filesWithMacCommands: string[];
} {
    const filesWithAppleScript: string[] = [];
    const filesWithMacCommands: string[] = [];

    function scan(currentDir: string): void {
        try {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                if (entry.isDirectory()) {
                    // Skip ignored directories
                    if (
                        !(IGNORED_DIRECTORIES as readonly string[]).includes(
                            entry.name,
                        )
                    ) {
                        scan(fullPath);
                    }
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (extensions.includes(ext)) {
                        if (checkFileForAppleScript(fullPath)) {
                            filesWithAppleScript.push(fullPath);
                        }
                        if (checkFileForMacCommands(fullPath)) {
                            filesWithMacCommands.push(fullPath);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error(
                `Failed to scan directory: ${currentDir}`,
                errorMessage,
            );
        }
    }

    scan(dir);
    return { filesWithAppleScript, filesWithMacCommands };
}

export function checkMacSpecificCode(
    projectPath: string,
): MacSpecificCodeCheckResult {
    const { filesWithAppleScript, filesWithMacCommands } =
        scanDirectory(projectPath);

    return {
        hasAppleScript: filesWithAppleScript.length > 0,
        hasMacCommands: filesWithMacCommands.length > 0,
        files: filesWithAppleScript,
        macCommandFiles: filesWithMacCommands,
    };
}
