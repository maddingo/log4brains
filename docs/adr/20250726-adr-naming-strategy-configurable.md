# Use the ADR slug as its unique ID

- Status: proposed
- Date: 2025-07-26

## Context and Problem Statement

The current ADR naming of the ADR and their unique ID are hard-coded. This makes it hard to add ADRs in a context where there already is a naming strategy established. The date as a unique ID also makes it hard to use as a reference in communication. The conflicts between branches should also be resolved by just talking to each other rather than resolving them automatically. An ADR is after all also a communication tool.

## Decision

Make ADR naming configurable, with the convention from [20201016-use-the-adr-slug-as-its-unique-id](20201016-use-the-adr-slug-as-its-unique-id.md) as the default. Additional naming conventions are added:

- date-prefix (the default)
- number-prefix (the convention from [20200926-use-the-adr-number-as-its-unique-id](20200926-use-the-adr-number-as-its-unique-id.md))
- simple-title (just the title, no numbering)
- project-id-number (like Jira, e.g. PRJ-1-short_title or ADR-15-short_title)

## Links

- Supersedes [20201016-use-the-adr-slug-as-its-unique-id](20201016-use-the-adr-slug-as-its-unique-id.md)
