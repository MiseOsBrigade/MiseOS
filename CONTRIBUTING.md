# Contributing to MiseOS

Thank you for your interest in contributing to MiseOS! We welcome contributions that help advance our mission of creating an agent-native operating layer for coordinating repositories, automation, and mobile Git workflows.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MiseOS.git
   cd MiseOS
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Setting Up Your Environment

- Ensure you have Node.js 18+ installed
- Install dependencies: `npm install`
- Review the `.miseos/` directory for mobile automation workflows

### Making Changes

1. **Keep changes focused** — one feature or bug fix per pull request
2. **Follow TypeScript conventions** — this project is TypeScript-first
3. **Test your changes locally** before submitting
4. **Maintain the design principles**:
   - GitHub remains canonical
   - Human approval is explicit
   - CI remains deterministic
   - Least privilege for automation

### Testing

- Run tests: `npm test`
- Verify no linting errors: `npm run lint`
- Test mobile workflows if applicable using `.miseos/shortcuts.md` guidance

## Submitting Changes

### Before You Submit

- Ensure your branch is up to date with `main`
- Write clear, descriptive commit messages
- Use signed commits when possible (`git commit -S`)
- Reference any related issues: "Fixes #123"

### Pull Request Process

1. Push your branch to your fork
2. Create a Pull Request with:
   - **Clear title** describing the change
   - **Description** explaining the "why" and "what"
   - **Related issues** (if any)
   - **Testing notes** for reviewers
3. Address review feedback promptly
4. Ensure all CI checks pass

### PR Title Guidelines

Use conventional commit format:
- `feat: add new mobile shortcut for branch creation`
- `fix: correct edge case in Working Copy sync`
- `docs: update mobile workflow documentation`
- `refactor: simplify agent patch validation`
- `test: add integration tests for signed commits`

## Documentation

- Update `README.md` for user-facing changes
- Update `.miseos/manifest.json` and `.miseos/commands.yaml` for mobile operations
- Add inline code comments for complex logic
- Include examples in documentation

## Reporting Issues

When filing an issue:
- Use a clear, descriptive title
- Describe the expected vs. actual behavior
- Include steps to reproduce
- Mention your environment (iOS version, Working Copy version, etc.)
- Attach relevant logs or screenshots

## Commit Message Guidelines

Write commit messages that:
- Start with a type: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`
- Use imperative mood: "add" not "added"
- Limit the first line to 72 characters
- Reference issues with `Fixes #123` or `Relates to #123`

Example:
```
feat: implement agent branch preparation workflow

- Add validation for patch integrity
- Ensure human approval before push
- Update shortcuts documentation

Fixes #45
```

## Design Principles

All contributions should respect MiseOS's core principles:

1. **GitHub is canonical** — Working Copy is a local edge workspace
2. **Human approval is explicit** — Changes must be reviewable before privileged operations
3. **CI is deterministic** — Heavy builds, tests, and security checks remain on GitHub Actions
4. **Offline-first editing** — iPad workflows should work without network access
5. **Least privilege** — Automation gets only necessary permissions
6. **Signed provenance** — Use signed commits for workflows requiring integrity guarantees

## Questions?

- Open a Discussion on GitHub
- Review `.miseos/` documentation for mobile automation context
- Check existing issues and PRs to avoid duplication

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to MiseOS! 🚀
