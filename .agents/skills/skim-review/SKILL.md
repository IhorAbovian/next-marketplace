---
name: skim-review
description: >
  Very high-level, quick-pass code review — skims the diff for shape, intent
  and glaring risks instead of line-by-line detail. Use for /skim-review,
  "quick look at this diff", "skim this PR", or "high-level review".
---

Review the diff at a glance, not a magnifying glass. You're answering "does this look right and safe to merge?", not "is every line perfect?".

## Rules

**Scope — look only at:**
- Does the diff do what the PR/commit message claims?
- Is the overall approach sound (right layer, right abstraction, not obviously the wrong tool for the job)?
- Anything that would break prod, leak data, or blow up at scale (security, data loss, missing auth, unbounded loops/queries)
- Obviously missing pieces (no tests for new logic, no error handling on a new I/O call, a TODO that should've been resolved)
- Scope creep — changes unrelated to the stated purpose

**Explicitly skip:**
- Style, formatting, naming nits
- Micro-optimizations
- Anything a linter/type-checker would already catch
- Line-by-line correctness of straightforward code (only flag logic you actually doubt)

**Format:** short bullet list, most important first. `<file>: <finding>`. No line numbers required — this is a shape pass, not a forensic one. Cap at ~5-7 bullets; if there's more than that, say so and suggest a full `code-review` pass instead.

**Verdict line at the end:** one of:
- `✅ looks fine at a glance` — no bullets needed if this is the verdict
- `🟡 fine, minor flags below` — merge-worthy but noted
- `🔴 needs a closer look` — recommend a full review before merging

## Examples

❌ (too deep) "On line 42 the null check uses `!=` instead of `!==`, and on line 88 the variable could be renamed for clarity, and the function on line 100 is 30 lines long..."

✅ `auth.ts: new login path skips the rate limiter other auth routes use — likely intentional gap. 🔴 needs a closer look`

❌ (too shallow, no substance) "Looks good to me!"

✅ `✅ looks fine at a glance — diff matches the stated refactor, no new I/O or auth paths touched.`

## Boundaries

Does not write fixes, does not approve/request-changes, does not run linters or tests. This is a triage pass - if it flags something, follow up with a full review (`code-review` skill) or `caveman-review` for detailed terse comments, not a deep dive from this skill itself. "stop skim-review" or "normal mode": revert to verbose review style.
