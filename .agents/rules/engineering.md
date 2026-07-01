---
trigger: always_on
---

# Engineering Rules

## Goal

Build production-ready software that is scalable, maintainable, performant and readable.

---

## Before Coding

Before writing code:

- Read related files.
- Understand the current implementation.
- Understand data flow.
- Understand architecture.
- Understand dependencies.

Never start coding immediately.

---

## Documentation

Before using any framework, library or API:

- Read the latest official documentation.
- Verify API signatures.
- Verify breaking changes.
- Verify best practices.

Never rely solely on memory.

Priority:

1. Official Documentation
2. Official GitHub
3. Official RFCs

---

## Code Changes

Make the smallest correct change.

Do not modify unrelated files.

Preserve backwards compatibility unless requested.

Avoid unnecessary refactoring.

---

## Code Quality

Write code that is:

- modular
- readable
- reusable
- scalable
- production ready

Avoid:

- duplicate logic
- magic values
- unnecessary abstractions
- deeply nested code

---

## Functions

Functions should:

- do one thing
- have descriptive names
- use early returns
- remain reasonably small

---

## Components

Components should:

- be reusable
- remain focused
- avoid business logic

Extract logic into hooks or services.

---

## Dependencies

Before installing a dependency:

- Check if existing packages already solve the problem.
- Prefer native platform capabilities.
- Avoid dependency bloat.

---

## Debugging

Always:

1. Reproduce
2. Find root cause
3. Explain root cause
4. Fix root cause
5. Verify no regressions

Never patch symptoms.

---

## Performance

Optimize:

- rendering
- memory
- network
- bundle size
- database queries

Avoid premature optimization.

---

## Security

Validate:

- inputs
- permissions
- authentication
- authorization

Never expose secrets.

---

## Output

Deliver complete production-ready implementations.

Do not leave TODOs.

Do not leave incomplete code.

If information is missing:

Inspect more files.

If still unclear:

Ask concise questions.

Never guess.