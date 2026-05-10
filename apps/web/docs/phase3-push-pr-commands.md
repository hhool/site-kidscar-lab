# Phase 3 Push And PR Commands

Use this as the final command checklist after local commits are complete.

## 1) Configure Remote (only if missing)

```bash
git remote -v
git remote add origin <repo-url>
```

## 2) Push Current Main

```bash
git branch -M main
git push -u origin main
```

## 3) Optional: Push A Dedicated Release Branch

```bash
git checkout -b release/phase3-content-admin
git push -u origin release/phase3-content-admin
```

## 4) Open PR (Recommended Metadata)

Title (primary):

```text
feat(web): complete phase3 content admin workflow with release runbooks
```

Body source:

- docs/phase3-pr-ready-pack.md

## 5) Verify Included Commits

```bash
git log --oneline -n 8
```

Expected key commits include:

- d4d6f1a feat(web): finalize phase3 content admin delivery and release runbooks
- 5a4487a test(web): add unauthorized save negative-path ui coverage
- 53151b2 fix(web): ensure auth pill buttons always show visible labels
- f4ca659 fix(web): harden login/logout label visibility in top nav
- 5daba3c docs(web): add phase3 release 10-minute brief checklist
- 2b60f4c docs(web): add phase3 pr ready pack and readme entry

## 6) Pre-Push Safety Check

```bash
git status --short
```

Proceed only when output is empty.
