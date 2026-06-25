# StudySprint Design System

## Philosophy

StudySprint is not a casual productivity app.

It is a premium productivity platform for:

- Students
- Developers
- Professionals
- Competitive exam aspirants

The interface must communicate:

- Focus
- Discipline
- Consistency
- Progress
- Premium quality

Every screen should feel intentional.

If a UI element does not improve usability or clarity, remove it.

---

# Core Design Principles

## 1. Simplicity First

Before adding:

- gradients
- shadows
- borders
- badges
- icons

Ask:

"Does this improve the experience?"

If not:

Remove it.

---

## 2. Content Over Decoration

Users open StudySprint to:

- Study
- Focus
- Track progress

Not to admire visual effects.

Data should always have higher visual priority than decoration.

---

## 3. Consistency Beats Creativity

Never redesign components differently across screens.

Buttons should feel like the same system.

Cards should feel like the same system.

Typography should feel like the same system.

Consistency creates trust.

---

## 4. White Space Is A Feature

Never try to fill empty space.

Professional apps use breathing room.

Examples:

- Linear
- Raycast
- Arc Browser
- Stripe Dashboard

---

## Color Palette

### Background

Primary Background

```css
#0B1020
```

Secondary Background

```css
#111827
```

Surface

```css
#161F38
```

Elevated Surface

```css
#1E293B
```

---

### Text

Primary

```css
#FFFFFF
```

Secondary

```css
#94A3B8
```

Muted

```css
#64748B
```

---

### Borders

Primary Border

```css
rgba(255,255,255,0.08)
```

Secondary Border

```css
rgba(255,255,255,0.04)
```

---

### Semantic Colors

Focus

```css
#10B981
```

Break

```css
#06B6D4
```

Achievement

```css
#FBBF24
```

Warning

```css
#F59E0B
```

Error

```css
#EF4444
```

Success

```css
#10B981
```

---

# Color Usage Rules

## Green

Reserved for:

- Active focus
- Success
- Productivity metrics

Never use green for decoration.

---

## Cyan

Reserved for:

- Break states
- Informational indicators

---

## Amber

Reserved for:

- Achievements
- XP
- Milestones
- Level rewards

---

## Red

Reserved only for:

- Errors
- Destructive actions

Never use red for regular UI.

---

# Typography

## Rule

Maximum 4 text styles per screen.

---

### H1

```css
32px
800
```

Screen Titles

Example:

```text
Sprint
Community
Progress
```

---

### H2

```css
20px
700
```

Card Titles

---

### Body

```css
14px
500
```

Descriptions

---

### Caption

```css
10px
600
```

Metadata

Examples:

```text
LIVE
TODAY
LEVEL 5
```

---

# Cards

## Card Formula

Background

```css
bg-white/[0.03]
```

Border

```css
border-white/10
```

Radius

```css
rounded-3xl
```

---

## Never

Avoid:

```css
shadow-2xl
shadow-black/90
```

Heavy shadows look cheap.

---

# Buttons

## Primary Button

Background

```css
bg-white
```

Text

```css
text-black
```

Purpose

Primary action only.

Example:

```text
Start Sprint
Join Group
Create Battle
```

---

## Secondary Button

Background

```css
bg-white/5
```

Border

```css
border-white/10
```

Text

```css
text-white
```

---

# Spacing System

Only use:

```text
2
4
6
8
12
16
24
32
48
```

Avoid random values.

Bad:

```css
mt-[13px]
```

Good:

```css
mt-3
mt-4
mt-6
```

---

# Icons

Use icons only when they improve scan speed.

Never add icons because a screen looks empty.

---

# Animations

Duration

```css
200ms - 300ms
```

Maximum

```css
400ms
```

Avoid:

- bouncing
- shaking
- spinning
- flashy transitions

StudySprint should feel calm.

---

# NativeWind Rules

Prefer:

```tsx
className = "px-6 py-4";
```

Over:

```tsx
style={{
  paddingHorizontal: 24,
  paddingVertical: 16,
}}
```

Use style prop only for:

- dynamic colors
- dynamic sizes
- animation values

Everything else should use NativeWind.

---

# Component Rules

Each component should have one responsibility.

Bad:

```text
Timer
+ Firestore
+ API calls
+ UI
+ Analytics
```

Good:

```text
Timer UI
```

```text
Timer Hook
```

```text
Timer Service
```

Separate concerns aggressively.

---

# Premium UI Checklist

Before shipping any screen ask:

✓ Is it visually consistent?

✓ Is there enough white space?

✓ Is the hierarchy obvious in 3 seconds?

✓ Is every color intentional?

✓ Is every icon necessary?

✓ Does it feel like a premium SaaS product?

✓ Would this look out of place in Linear or Raycast?

If yes, redesign it.
