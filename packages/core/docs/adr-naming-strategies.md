# ADR Naming Strategies

Log4brains supports different naming strategies for Architecture Decision Records (ADRs) through a configurable strategy pattern.

## Available Strategies

### Date Prefix Strategy (default)

- **Strategy ID**: `date-prefix`
- **Format**: `YYYYMMDD-slugified-title`
- **Example**: `20240115-use-microservices-architecture.md`
- **Use case**: When you want chronological ordering and clear timestamps

### Number Prefix Strategy

- **Strategy ID**: `number-prefix`
- **Format**: `NNNN-slugified-title` (zero-padded)
- **Example**: `0001-use-microservices-architecture.md`
- **Use case**: When you prefer sequential numbering like traditional ADR tools

### Simple Title Strategy

- **Strategy ID**: `simple-title`
- **Format**: `slugified-title`
- **Example**: `use-microservices-architecture.md`
- **Use case**: When you want clean, simple filenames without prefixes

### Project Id Number Strategy

- **Strategy ID**: `project-id-number`
- **Format**: `ID-N-title`
- **Example**: `PRJ-1-use-microservice-architecture.md`
- **Use case**: When you want to use easy to remember ADR ids with a short project ID and a short number

## Configuration

Configure the naming strategy in your `.log4brains.yml` file:

```yaml
project:
  name: My Project
  tz: Europe/Paris
  adrFolder: ./docs/adr
  naming:
    strategy: date-prefix # or 'number-prefix', 'simple-title'
    options: {}
```

## Package-Specific ADRs

All strategies support package-specific ADRs in multi-package projects:

- Global ADR: `20240115-use-microservices-architecture.md`
- Package ADR: `backend/20240115-implement-user-service.md`

## Strategy Behavior

### Date Prefix Strategy

- Uses current date when creating new ADRs
- Automatically handles duplicate titles by appending `-2`, `-3`, etc.
- Provides clear chronological context

### Number Prefix Strategy

- Automatically finds the next available number by examining existing ADR files
- Numbers are zero-padded to 4 digits (0001, 0002, etc.)
- Maintains sequential ordering regardless of creation date

### Simple Title Strategy

- Creates clean, readable filenames
- Handles duplicates by appending `-2`, `-3`, etc.
- Best for projects where chronological order isn't important

## Migration Between Strategies

You can change strategies at any time. Existing ADRs will remain with their current naming, while new ADRs will use the new strategy. This allows for gradual migration if desired.

## Implementation Details

The naming strategy pattern is implemented in the core domain layer:

- `AdrNamingStrategy` interface defines the contract
- Strategy implementations handle the specific naming logic
- `AdrNamingStrategyFactory` creates strategy instances
- Configuration is handled through the project schema
- Dependency injection initializes the strategy at startup
