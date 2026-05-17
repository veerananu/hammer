# How to use these skill files

Two skill files are included:

1. **senior-dev-SKILL.md** — Makes Copilot write production-quality code
   (security, error handling, testing, naming, observability). Includes
   a section with Go-specific rules from Google's Go Style Guide.
2. **go-humanizer-SKILL.md** — Rewrites AI-generated Go code to look
   hand-written by a real Gopher. Includes 33 AI tells covering both
   common AI patterns and Google's Go Style Guide naming conventions.

---

## Installation

Both files must be renamed to `SKILL.md` and placed in their own folders.

### For GitHub Copilot (in your project)

In your project root, create this folder structure:

```
.github/
  skills/
    senior-dev/
      SKILL.md          ← rename senior-dev-SKILL.md to this
    go-humanizer/
      SKILL.md          ← rename go-humanizer-SKILL.md to this
```

Then commit and push so it works in Copilot Coding Agent online too.

### For Claude Code

```
~/.claude/skills/
  senior-dev/
    SKILL.md
  go-humanizer/
    SKILL.md
```

### For Cursor

```
.cursor/skills/
  senior-dev/
    SKILL.md
  go-humanizer/
    SKILL.md
```

---

## Using the skills

Open Copilot Chat (or Claude Code / Cursor agent) and switch to **Agent
mode**. The skills load automatically based on what you ask.

**Examples:**

- "Write a user signup endpoint" → uses **senior-dev**
- "Humanize this Go file" → uses **go-humanizer**
- "Use the senior-dev skill to refactor this function" → forces
  senior-dev
- "Use the go-humanizer skill on main.go" → forces go-humanizer

**Verify they loaded:**

```
What skills are available in this workspace?
```

The reply should list both `senior-dev` and `go-humanizer`.

---

## Honest notes

- These skills bias the AI toward better output. They don't guarantee
  perfect code or 100% bypass of AI detectors.
- Read the output. The skill is a strong nudge, not a replacement for
  reviewing what comes back.
- Skills only work in **Agent mode**, not in the gray-text inline
  autocomplete.
