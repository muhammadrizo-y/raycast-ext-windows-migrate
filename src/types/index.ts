export interface MacSpecificCodeCheckResult {
    hasAppleScript: boolean;
    hasMacCommands: boolean;
    files: string[];
    macCommandFiles: string[];
}

export interface CommandResult {
    success: boolean;
    output: string;
    error: string;
}

export interface UpdateDependenciesResult {
    success: boolean;
    message: string;
    ncuOutput?: string;
    installOutput?: string;
    output?: string;
}

export interface EslintUpdateResult {
    success: boolean;
    message: string;
    actions: string[];
}

export interface PackageJsonUpdateResult {
    success: boolean;
    message: string;
    action?: string;
}

export interface ExecError extends Error {
    stdout?: string;
    stderr?: string;
    code?: number;
}
