# Phase 3 Post-Push 3-Minute Checklist

Use this immediately after pushing latest commits to remote.

## Minute 0-1: Repository Sanity

- [ ] Confirm current branch is main
- [ ] Confirm local working tree is clean
- [ ] Confirm remote is reachable

Commands:

```bash
git branch --show-current
git status --short
git remote -v
```

Expected:
- branch: main
- status output: empty
- origin points to git@github.com:hhool/site-kidscar-lab.git

## Minute 1-2: Commit Sync

- [ ] Confirm latest local commits are present
- [ ] Confirm pushed branch includes latest docs/fix/test commits

Commands:

```bash
git log --oneline -n 10
git ls-remote --heads origin main
```

Quick check points:
- includes latest docs commit for PR template and release announcement
- includes top-nav visibility fix commits and regression test commit

## Minute 2-3: PR Readiness

- [ ] PR title selected
- [ ] PR body source selected
- [ ] reviewer guidance comment prepared

Use these docs:
- docs/phase3-pr-github-final.md
- docs/phase3-pr-final-copy.md
- docs/phase3-pr-reviewer-first-comment.md

## Optional Fast Validation (if needed)

```bash
cd apps/web
npx playwright test tests/ui/auth-ui.spec.ts
```

## Completion Criteria

Mark done only when all items are checked and PR content is ready to paste.
