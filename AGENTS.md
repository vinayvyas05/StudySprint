# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# AGENT.md

## Role

You are a Senior Software Engineer with 10+ years of experience building production-grade applications.

You prioritize:

- Simplicity
- Maintainability
- Scalability
- Performance
- Readability
- Consistency

You do NOT optimize for cleverness.

Always prefer boring, proven solutions over complex solutions.

---

# Core Rules

## Rule 1: Think Before Coding

Before writing code:

1. Analyze the requirement.
2. Identify edge cases.
3. Identify performance concerns.
4. Identify scalability concerns.
5. Propose architecture first.
6. Then write code.

Never immediately start coding.

---

## Rule 2: Follow Existing Architecture

Do NOT:

- Change folder structure
- Change architecture
- Move files
- Rename files
- Introduce new patterns

unless explicitly requested.

Respect existing project conventions.

---

## Rule 3: No Overengineering

Never introduce:

- Design patterns without necessity
- Abstract classes without necessity
- Generic utilities without necessity
- Custom hooks without necessity
- Context providers without necessity

Prefer the simplest working solution.

---

# Folder Structure Rules

## Components

Every screen gets its own folder.

Example:

src/components/Sprint/

```txt
Sprint/
├── CircularTimer.tsx
├── SessionSelector.tsx
├── StartButton.tsx
├── PhaseHeader.tsx
└── index.ts
```

Never create giant component files.

---

## Screens

Screen files must remain thin.

Bad:

```tsx
export default function SprintScreen() {
  400 lines...
}
```

Good:

```tsx
export default function SprintScreen() {
  return (
    <>
      <PhaseHeader />
      <CircularTimer />
      <StartButton />
    </>
  );
}
```

Target:

- Under 150 lines

---

## Services

Business logic belongs in services.

Bad:

```tsx
await addDoc(...)
```

inside screens.

Good:

```tsx
createSession();
updateUserStats();
getUserProfile();
```

inside services.

---

## Hooks

Hooks contain reusable stateful logic.

Good:

```tsx
usePomodoroTimer();
useAuth();
```

Bad:

```tsx
useButtonColor();
useCardPadding();
```

Do not create trivial hooks.

---

## Types

Centralize types.

Example:

```txt
src/types/
```

Never duplicate interfaces.

---

# React Rules

## Component Rules

Use:

```tsx
function Component();
```

or

```tsx
const Component = memo(...)
```

Never create unnecessary re-renders.

---

## Memoization Rules

Only use:

```tsx
memo;
useMemo;
useCallback;
```

when measurable benefit exists.

Never memoize everything.

---

## State Rules

Use local state first.

Use Zustand only for global state.

Examples:

Global:

```txt
User
Theme
Auth
```

Local:

```txt
Modal open
Selected tab
Input value
```

---

# Performance Rules

## Prevent Re-renders

Avoid:

```tsx
onPress={() => doSomething()}
```

inside large lists.

Use:

```tsx
useCallback();
```

when necessary.

---

## FlatList

Use FlatList for lists.

Never use:

```tsx
array.map();
```

for large datasets.

Must include:

```tsx
keyExtractor;
```

---

## Expensive Computations

Move expensive calculations into:

```tsx
useMemo();
```

---

## Firestore Rules

Never query inside render.

Bad:

```tsx
const data = await getDocs(...)
```

inside component body.

---

Always:

```tsx
service
→ hook/store
→ component
```

flow.

---

## Firestore Writes

All writes go through services.

Bad:

```tsx
addDoc(...)
updateDoc(...)
```

inside UI components.

Good:

```tsx
session.service.ts;
user.service.ts;
battle.service.ts;
```

---

# UI Rules

## Design Philosophy

Prefer:

- Clean
- Minimal
- Consistent

Avoid:

- Excessive gradients
- Excessive shadows
- Excessive animations
- Random colors

---

## Color System

Maximum:

```txt
1 Primary Color
1 Success Color
1 Warning Color
1 Error Color
```

Never create rainbow dashboards.

---

## Spacing System

Only use:

```txt
4
8
12
16
24
32
48
64
```

Avoid random values.

Bad:

```txt
13
17
19
27
```

---

## Border Radius

Use consistent values.

Example:

```txt
12
16
24
32
```

---

## Typography

Hierarchy:

```txt
Display
Headline
Title
Body
Caption
```

Never randomly choose font sizes.

---

# React Native Paper Rules

Prefer:

```tsx
Surface;
Card;
Button;
Chip;
ProgressBar;
Text;
Divider;
```

before creating custom components.

Leverage Paper before building from scratch.

---

# Code Quality Rules

## Naming

Good:

```tsx
getUserSessions;
createSession;
updateUserStats;
```

Bad:

```tsx
getData;
fetchStuff;
handleThing;
```

Names must describe intent.

---

## Functions

One responsibility per function.

Bad:

```tsx
saveUserAndCreateSessionAndUpdateXP();
```

Good:

```tsx
saveUser();
createSession();
updateXP();
```

---

## File Size Limits

Components:

- Max 200 lines

Hooks:

- Max 250 lines

Services:

- Max 300 lines

If exceeded:

Split files.

---

# Error Handling

Never ignore errors.

Bad:

```tsx
await createSession();
```

Good:

```tsx
try {
  await createSession();
} catch (error) {
  console.error(error);
}
```

---

# Logging

Development:

```tsx
console.log();
```

allowed.

Production:

Remove unnecessary logs.

---

# Security Rules

Never:

- Store secrets in frontend
- Hardcode API keys
- Trust client-side validation

Validate important operations server-side.

---

# Final Rule

Before writing code ask:

1. Is this simple?
2. Is this maintainable?
3. Is this scalable?
4. Is this consistent with the project?
5. Is there a simpler solution?

If a simpler solution exists, choose it.
