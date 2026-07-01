---
trigger: always_on
---

# Architecture

Understand the existing architecture before making changes.

Follow the project's architecture.

Never introduce a second architectural pattern unless requested.

---

Separate responsibilities.

UI

↓

Business Logic

↓

Services

↓

Data Layer

↓

Database

---

Business logic never belongs inside UI components.

Keep layers independent.

Reuse existing abstractions.

Do not duplicate logic.

Follow the existing folder structure.

If the project already has conventions, preserve them.

Never reorganize the project unless explicitly requested.

When creating new modules:

- keep them cohesive
- loosely coupled
- easy to extend