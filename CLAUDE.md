# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development Workflow

```bash
# Install dependencies for all packages
yarn install

# Development (watch mode for all packages)
yarn dev

# Build all packages
yarn build

# Run tests across all packages
yarn test

# Run tests only for changed packages
yarn test:changed

# Lint all packages
yarn lint

# Type checking
yarn typescript

# Format code
yarn format --write

# Clean build artifacts
yarn clean
```

### Log4brains Specific Commands

```bash
# Start local preview server with hot reload
log4brains preview

# Create a new ADR interactively
log4brains adr new

# Build static site for deployment
log4brains build

# Serve built static site locally
yarn serve-log4brains
```

### Package-Level Development

Individual packages can be developed independently:

```bash
cd packages/core
yarn dev          # Watch mode
yarn test         # Run package tests
yarn typescript   # Type check this package
```

## Architecture Overview

Log4brains is a **monorepo** managed with **Lerna** and **Yarn Workspaces** containing 6 packages:

### Core Packages

- **`@log4brains/core`** - Domain logic using **Domain-Driven Design (DDD)** and **hexagonal architecture**

  - Domain models for ADRs, packages, markdown processing
  - Application layer with CQRS (command/query handlers)
  - Infrastructure layer with repositories and external integrations
  - Uses dependency injection with **Awilix**

- **`@log4brains/web`** - **Next.js** based web UI and static site generator
  - React components with **Material-UI**
  - Static site generation for GitHub/GitLab Pages
  - Search functionality with **Lunr.js**
  - Real-time preview with hot reload

### CLI Packages

- **`@log4brains/cli`** - Main CLI commands (`adr new`, `list`)
- **`@log4brains/cli-common`** - Shared CLI utilities and console handling
- **`@log4brains/global-cli`** - Global entry point (`log4brains` command)
- **`@log4brains/init`** - Project initialization (`log4brains init`)

### Architecture Patterns

- **DDD with hexagonal architecture** in core package - domain is isolated from infrastructure
- **CQRS pattern** - separate command and query handlers
- **Dependency injection** - uses Awilix container for IoC
- **Repository pattern** - abstract data access behind interfaces
- **Markdown-first** - ADRs are stored as markdown files in git

### Key Technologies

- **TypeScript** with strict mode
- **Lerna** for monorepo management
- **Jest** for testing
- **ESLint + Prettier** for code quality
- **Microbundle** for package building
- **Next.js** for web UI and static generation

## Development Notes

### Testing

- Run `yarn test` from root for all packages
- Integration tests exist in `packages/core/integration-tests/`
- Web components have Storybook stories in `packages/web/nextjs/`

### Commits

- Uses **conventional commits** with Commitizen
- Husky pre-commit hooks run linting and type checking
- Releases managed through `./scripts/release.sh`

### Configuration

Projects using Log4brains configure via `.log4brains.yml` in their repository root.
