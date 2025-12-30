import chalk from "chalk";
import ora from "ora";
import { checkAppleScript } from "./utils/checkAppleScript.js";
import { updateDependencies, runCommand } from "./utils/updateDependencies.js";
import { updateEslintConfig } from "./utils/updateEslint.js";
import { updatePackageJsonPlatforms } from "./utils/updatePackageJson.js";

function showHelp() {
    console.log(
        chalk.bold.cyan("\n🚀 Raycast Extension Windows Migration Tool\n"),
    );
    console.log(chalk.bold("Usage:"));
    console.log(chalk.gray("  raycast-ext-windows-migrate [options]\n"));
    console.log(chalk.bold("Options:"));
    // Nicer, better-formatted options
    console.log(
        chalk.white.bold("  --skip-applescript, -s"),
        "\n    ",
        chalk.gray("Skip the AppleScript usage check."),
        "\n    ",
        chalk.gray(
            "Use if you've already implemented Windows PowerShell alternatives.",
        ),
        "\n",
    );
    console.log(
        chalk.white.bold("  --help, -h"),
        "\n    ",
        chalk.gray("Show this help message."),
        "\n",
    );
    console.log(chalk.bold("Steps:"));
    console.log(
        chalk.gray(
            "  1. Check AppleScript usage (optional, skipped with -s flag)",
        ),
    );
    console.log(
        chalk.gray("  2. Update all dependencies to the latest version"),
    );
    console.log(chalk.gray("  3. Configure ESLint to the latest format"));
    console.log(
        chalk.gray("  4. Update package.json to add Windows platform support"),
    );
    console.log(chalk.gray("  5. Run lint and build checks\n"));
    process.exit(0);
}

async function main() {
    // Parse command-line arguments
    if (process.argv.includes("--help") || process.argv.includes("-h")) {
        showHelp();
    }

    const projectPath = process.cwd();
    const skipAppleScript =
        process.argv.includes("--skip-applescript") ||
        process.argv.includes("-s");

    console.log(
        chalk.bold.cyan("\n🚀 Raycast Extension Windows Migration Tool\n"),
    );

    // Step 1: Check AppleScript usage (optional)
    console.log(chalk.bold("Step 1/6: Check AppleScript usage"));
    if (!skipAppleScript) {
        const spinner1 = ora("Scanning project files...").start();

        const appleScriptCheck = checkAppleScript(projectPath);

        if (appleScriptCheck.hasAppleScript) {
            spinner1.fail(chalk.red("AppleScript usage detected!"));
            console.log(chalk.yellow("\nThe following files use AppleScript:"));
            appleScriptCheck.files.forEach((file) => {
                console.log(chalk.yellow(`  - ${file}`));
            });
            console.log(
                chalk.red(
                    "\n❌ This extension cannot be converted to support Windows because it uses AppleScript.\n",
                ),
            );
            console.log(
                chalk.yellow(
                    "💡 Tip: If you've already implented Windows PowerShell alternatives, use --skip-applescript (or -s) to bypass this check.\n",
                ),
            );
            process.exit(1);
        }

        spinner1.succeed(chalk.green("No AppleScript usage detected"));
    } else {
        const spinner1 = ora("Skipped").start();
        spinner1.succeed(
            chalk.gray("Skipped (--skip-applescript or -s flag detected)"),
        );
    }

    // Step 2: Update dependencies
    console.log(chalk.bold("\nStep 2/6: Update dependencies"));
    const spinner2 = ora("Running npm-check-updates...").start();

    const updateResult = await updateDependencies(projectPath);

    if (!updateResult.success) {
        spinner2.fail(chalk.red(updateResult.message));
        if (updateResult.output) {
            console.log(chalk.gray(updateResult.output));
        }
        process.exit(1);
    }

    spinner2.succeed(chalk.green("Dependencies updated successfully"));
    if (updateResult.ncuOutput) {
        console.log(chalk.gray(updateResult.ncuOutput));
    }

    // Step 3: Update ESLint configuration
    console.log(chalk.bold("\nStep 3/6: Update ESLint configuration"));
    const spinner3 = ora("Updating ESLint configuration...").start();

    const eslintResult = updateEslintConfig(projectPath);

    if (!eslintResult.success) {
        spinner3.fail(chalk.red(eslintResult.message));
        process.exit(1);
    }

    spinner3.succeed(chalk.green("ESLint configuration updated successfully"));
    eslintResult.actions.forEach((action) => {
        console.log(chalk.gray(`  - ${action}`));
    });

    // Step 4: Update package.json platforms
    console.log(chalk.bold("\nStep 4/6: Update package.json platforms"));
    const spinner4 = ora("Updating platforms field...").start();

    const packageJsonResult = updatePackageJsonPlatforms(projectPath);

    if (!packageJsonResult.success) {
        spinner4.fail(chalk.red(packageJsonResult.message));
        process.exit(1);
    }

    spinner4.succeed(chalk.green(packageJsonResult.message));
    if (packageJsonResult.action) {
        console.log(chalk.gray(`  - ${packageJsonResult.action}`));
    }

    // Step 5: Run ray lint --fix
    console.log(chalk.bold("\nStep 5/6: Run ray lint --fix"));
    const spinner5 = ora("Running Raycast lint...").start();

    const lintResult = runCommand("npx ray lint --fix", projectPath);

    spinner5.succeed(chalk.green("Lint completed"));
    if (lintResult.output) {
        console.log(chalk.gray(lintResult.output));
    }
    if (lintResult.error) {
        console.log(chalk.yellow(lintResult.error));
    }

    // Step 6: Run npm run build
    console.log(chalk.bold("\nStep 6/6: Run npm run build"));
    const spinner6 = ora("Building project...").start();

    const buildResult = runCommand("npm run build", projectPath);

    if (!buildResult.success) {
        spinner6.fail(chalk.red("Build failed"));
        console.log(chalk.red(buildResult.error));
        if (buildResult.output) {
            console.log(chalk.gray(buildResult.output));
        }
        process.exit(1);
    }

    spinner6.succeed(chalk.green("Build successful"));
    if (buildResult.output) {
        console.log(chalk.gray(buildResult.output));
    }

    // Complete
    console.log(chalk.bold.green("\n✅ Migration completed!\n"));
    console.log(chalk.cyan("Next steps:"));
    console.log(
        chalk.white(
            "1. Verify that step 5 (lint) and step 6 (build) passed successfully, if not, fix the errors and run the tool again",
        ),
    );
    console.log(
        chalk.white(
            "2. Update CHANGELOG.md: Add a new entry under the title with the example format:",
        ),
    );
    console.log(chalk.gray("\n     ## [Maintenance] - {PR_MERGE_DATE}\n"));
    console.log(chalk.gray("     - Add support for Windows platform."));
    console.log(chalk.gray("     - Bump all dependencies to the latest.\n"));
    console.log(chalk.white("3. Test the extension functionality on Windows"));
    console.log(chalk.white("4. Commit changes and create a Pull Request\n"));
}

main().catch((error) => {
    console.error(chalk.red("\n❌ Error occurred:"), error);
    process.exit(1);
});
