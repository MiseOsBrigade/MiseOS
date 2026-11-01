# Contributing to mise-brigade-de-repo

Thank you for your interest in contributing to mise-brigade-de-repo!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/mise-brigade-de-repo.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`

## Making Changes

1. Make your changes in your feature branch
2. Test locally if applicable
3. Commit your changes with clear, descriptive messages
4. Push to your fork
5. Open a Pull Request against `main`

## Workflow Guidelines

When adding or modifying GitHub Actions workflows:
- Use kebab-case for workflow filenames (no spaces)
- Place all workflows in `.github/workflows/`
- Include `name:` at the top of each workflow
- Use `permissions:` block for security
- Include `workflow_dispatch` for manual testing
- Use `concurrency:` to prevent concurrent runs

## Documentation Guidelines

- Use Markdown for documentation
- Include code examples where applicable
- Keep docs up-to-date with code changes
- Use consistent formatting

## Testing

- Test workflow changes using `workflow_dispatch`
- Verify branch protection rules work correctly
- Check that automation respects boundaries

## Reporting Issues

- Use GitHub Issues for bugs and feature requests
- Include reproduction steps for bugs
- Check existing issues before creating new ones

## Questions?

Feel free to open a Discussion if you have questions about contributing.