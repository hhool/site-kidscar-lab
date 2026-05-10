# Phase 3 One-Shot Push Guide

Use this checklist to go from local-ready to remote-pushed in one pass.

## 0) Preconditions

- Current branch is `main`
- Working tree is clean (`git status --short` returns empty)
- You have the target remote URL ready

## 1) Verify Local State

```bash
git status --short
git branch --show-current
git log --oneline -n 8
```

Expected:
- no pending changes
- branch is `main`
- latest commits include Phase 3 fix/test/docs updates

## 2) Configure Remote (If Missing)

```bash
git remote -v
git remote add origin <repo-url>
```

If `origin` already exists and is wrong, update it:

```bash
git remote set-url origin <repo-url>
```

## 3) Push Main

```bash
git branch -M main
git push -u origin main
```

## 4) Optional: Push A Release Branch Instead

```bash
git checkout -b release/phase3-content-admin
git push -u origin release/phase3-content-admin
```

## 5) Open PR With Prepared Content

Use:
- docs/phase3-pr-ready-pack.md
- docs/phase3-commit-release-notes.md

Recommended title:

```text
feat(web): complete phase3 content admin workflow with release runbooks
```

## 6) Final Sanity Checks Before Merge

```bash
git status --short
```

And ensure:
- acceptance command block has recent green result
- release-day owner/operator/qa/observer are assigned
- snapshot backup path is recorded
