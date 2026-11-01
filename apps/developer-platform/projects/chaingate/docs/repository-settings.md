# Recommended GitHub repository settings

## General

- Default branch: `main`
- Enable Discussions, Issues, Projects, and private vulnerability reporting
- Disable force pushes and branch deletion on `main`
- Automatically delete merged branches
- Use squash merge with Conventional Commit titles

## Required status checks

- CI / validate
- Security / codeql
- Security / dependency-review for pull requests
- Contracts / foundry when contract files change

Require pull-request reviews, conversation resolution, signed commits for maintainers where practical, and CODEOWNERS review for security-sensitive paths.

## Security

Enable Dependabot alerts and updates, secret scanning, push protection, CodeQL default setup or the supplied workflow, and dependency graph.

## Repository description and topics

Description: `Human-approved multichain trust gateway for AI-assisted blockchain applications.`

Topics: `miseos`, `blockchain`, `metamask`, `multichain`, `ai-agents`, `wallet-security`, `provenance`, `typescript`, `solidity`, `base`, `goodshyt`
