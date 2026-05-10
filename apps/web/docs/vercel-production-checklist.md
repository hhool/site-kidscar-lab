# Vercel Production Checklist

Use this checklist in the Vercel console to resolve production deployment and domain issues.

## 1) Project Binding

Path:
- Vercel Dashboard -> Project -> Settings -> General

Check:
- Project is the intended repo: `hhool/site-kidscar-lab`
- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Production Branch: `main`

Correct values:
- Root Directory must be `apps/web`
- Production Branch must be `main`

## 2) Build Configuration

Path:
- Vercel Dashboard -> Project -> Settings -> General -> Build & Development Settings

Check:
- Build Command is auto-detected or `npm run build`
- Install Command is auto-detected or `npm install`
- Output Directory is default for Next.js

Correct values:
- Build Command: `npm run build`
- Install Command: `npm install`
- Do not override output unless required

## 3) Environment Variables

Path:
- Vercel Dashboard -> Project -> Settings -> Environment Variables

Check required variables:
- `CONTENT_ADMIN_TOKEN`
- `CONTENT_ROLLBACK_REVIEWERS`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`

Correct values:
- All four variables present in Production
- `NEXT_PUBLIC_SITE_URL` is the real production URL
- `DATABASE_URL` points to reachable production Postgres

## 4) Deployment Status

Path:
- Vercel Dashboard -> Project -> Deployments

Check:
- Latest commit includes `7f3e5be`
- A successful deployment exists for latest `main`
- Deployment is marked Production or can be promoted

Correct values:
- Latest successful deployment should be built from `main`
- If latest deployment is Preview only, use `Promote to Production`
- If latest deployment failed, run `Redeploy`

## 5) Domain Mapping

Path:
- Vercel Dashboard -> Project -> Settings -> Domains

Check:
- `site-kidscar-lab.vercel.app` is attached to this project
- Any custom production domain is also attached here
- No other Vercel project is owning the intended domain

Correct values:
- Production URL resolves to this exact project
- Domain status is valid / configured

## 6) If You See Platform 404 NOT_FOUND

Meaning:
- Vercel does not currently have a successful production deployment attached to that domain/project
- or the domain points to the wrong project

Do this in order:
1. Confirm Root Directory = `apps/web`
2. Confirm Production Branch = `main`
3. Confirm latest commit `7f3e5be` appears in Deployments
4. Redeploy that commit if needed
5. Promote successful deployment to Production
6. Re-open the production domain

## 7) Post-Deploy Verification

After successful production deploy:
1. Open `/admin/content?lang=en`
2. Perform one reversible save
3. Record `save requestId`
4. Filter History by `requestId`
5. Smoke-check:
   - `/products`
   - `/reviews`
   - `/rankings`
   - `/news`
   - `/guides`
   - `/brands`
   - `/deals`
   - `/community`
6. Check `/sitemap.xml`

## 8) Fast Decision Tree

- Build fails with missing file:
  - verify latest `main` includes `7f3e5be`
- Build succeeds but domain 404s:
  - verify Domains + Production Deployment
- Domain opens but app data fails:
  - verify env vars + DB connectivity

## 9) Related Docs

- docs/phase3-deployment-execution.md
- docs/phase3-deployment-live-script-filled.md
- docs/phase3-final-handoff-index.md
