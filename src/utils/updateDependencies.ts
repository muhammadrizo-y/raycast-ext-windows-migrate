import { execSync } from "child_process";
import type {
    CommandResult,
    UpdateDependenciesResult,
    ExecError,
} from "../types/index.js";

function executeCommand(command: string, cwd: string): CommandResult {
    try {
        const output = execSync(command, {
            cwd,
            encoding: "utf-8",
            stdio: "pipe",
        });
        return { success: true, output, error: "" };
    } catch (error) {
        const execError = error as ExecError;
        return {
            success: false,
            output: execError.stdout || "",
            error: execError.stderr || execError.message || String(error),
        };
    }
}

export async function updateDependencies(
    projectPath: string,
): Promise<UpdateDependenciesResult> {
    // Execute npm-check-updates
    const ncuResult = executeCommand("npx npm-check-updates -u", projectPath);

    if (!ncuResult.success) {
        return {
            success: false,
            message: `Failed to execute npm-check-updates: ${ncuResult.error}`,
            output: ncuResult.output,
        };
    }

    // Execute npm install with --legacy-peer-deps to handle potential peer dependency conflicts
    const installResult = executeCommand(
        "npm install --legacy-peer-deps",
        projectPath,
    );

    if (!installResult.success) {
        return {
            success: false,
            message: `Failed to execute npm install: ${installResult.error}`,
            output: installResult.output,
        };
    }

    return {
        success: true,
        message: "Dependencies updated successfully",
        ncuOutput: ncuResult.output,
        installOutput: installResult.output,
    };
}

export function runCommand(command: string, cwd: string): CommandResult {
    return executeCommand(command, cwd);
}
