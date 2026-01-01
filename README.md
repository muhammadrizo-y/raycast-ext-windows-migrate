# Raycast Extension Windows Migrate Tool

An automation tool for migrating Raycast extensions to support Windows platform.

## Features

- ✅ Automatically check if the project uses AppleScript or Mac-specific commands
- ✅ Update all dependencies to the latest version
- ✅ Configure ESLint to the latest format
- ✅ Update package.json to add Windows platform support
- ✅ Run lint and build checks

## Usage

Run in the root directory of your Raycast extension project:

```bash
# npm
npx raycast-ext-windows-migrate@latest

# pnpm
pnpm dlx raycast-ext-windows-migrate@latest

# bun
bunx raycast-ext-windows-migrate@latest
```

The tool will automatically:

1. Check for AppleScript and Mac-specific commands usage (will exit if detected)
2. Update all dependencies to the latest version
3. Update ESLint configuration to the latest format
4. Add Windows platform support to package.json
5. Run `npx ray lint --fix`
6. Run `npm run build`

### Flags

```
-s, --skip-applescript
    Skip the AppleScript and Mac-specific commands check.
    Use if you've already implemented cross-platform alternatives.

-h, --help
    Show this help message.
```

## Post-completion Steps

1. Verify that step 5 (lint) and step 6 (build) passed successfully
2. Update CHANGELOG.md: Add a new entry under the title with the following format:

    ```markdown
    ## [Maintenance] - {PR_MERGE_DATE}

    - Add support for Windows platform.
    - Bump all dependencies to the latest.
    ```

3. Test the extension functionality on Windows
4. Commit changes and create a Pull Request

## Technical Details

This tool is developed with TypeScript and built with tsup, containing the following modules:

- `checkMacSpecificCode.ts` - AppleScript and Mac-specific commands check
- `updateDependencies.ts` - Dependency update
- `updateEslint.ts` - ESLint configuration update
- `updatePackageJson.ts` - package.json update

### Development

```bash
# Install dependencies
pnpm install

# Development mode (auto recompile)
pnpm run dev

# Build
pnpm run build

# Format code
pnpm run format
```
