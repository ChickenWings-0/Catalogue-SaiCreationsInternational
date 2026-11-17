# Deployment: Vercel (static) + Custom Domain

> Do this in Phase 6. Steps marked **[client]** need the client's logins or decisions.
>
> The site is a **fully static export** (`output: 'export'` → `/out`). It uses no Vercel-only features: no image optimisation API, edge functions, middleware, API routes or ISR. Any static host can serve it, and §7 covers moving it to Cloudflare Pages without code changes.

---

## 0. This project: saicreationsintl.com (Squarespace Domains, Google Workspace email)

- **Domain:** `saicreationsintl.com`, bought through Google Workspace and now managed at **domains.squarespace.com**.
- **Email:** `info@saicreationsintl.com` runs on **Google Workspace**. Its MX / TXT (SPF, DKIM) records at Squarespace **must not be removed**. Squarespace usually groups them as a "Google Workspace" preset.
- **Vercel env (Production):** `NEXT_PUBLIC_SITE_URL = https://saicreationsintl.com` (or the www version if that is chosen as primary) and `SITE_ENV = production`. The code tolerates a missing `https://` or a trailing slash (`getSiteUrl()` in lib/content.ts). If `SITE_ENV` is missing, Vercel's own production flag is used.
- **Squarespace DNS steps:** Domains → saicreationsintl.com → **DNS → DNS Settings**. Screenshot everything first, delete only the **"Squarespace Defaults"** preset if present (its `@` A records and `www` CNAME clash with Vercel), and keep the Google Workspace records. Under **Custom Records**, add **A `@`** → the IP Vercel shows (usually `76.76.21.21`) and **CNAME `www`** → the value Vercel shows (usually `cname.vercel-dns.com`). Make sure domain forwarding is off.
- **Vercel Domains:** both `saicreationsintl.com` and `www.saicreationsintl.com` are added. One is primary; set the other to **Redirect (308)** to it. After go-live, set the project's `*.vercel.app` domain to redirect to the primary domain too.
- **Search engines:** `/robots.txt` and `/sitemap.xml` are generated at build time. Previews and local builds get `Disallow: /` and a `noindex` meta tag.

## 1. Before you start

| Item | Value | Notes |
|---|---|---|
| Domain name | **[client]** `TODO(client): example.com` | |
| Registrar | **[client]** `TODO(client)` | GoDaddy / Namecheap / Hostinger / BigRock / Squarespace / Cloudflare … |
| DNS login / contact | **[client]** `TODO(client)` | Someone who can add records |
| Email on this domain? | **[client]** `TODO(client): yes/no, provider` | Google Workspace / Microsoft 365 / Zoho / registrar mail … |
| Primary host | **`example.com` (bare domain)** ✅ decided | `www.example.com` → 308 redirect → `example.com` |
| Vercel account & plan | **Hobby** ✅ decided | Expected traffic is under 100 visitors/month. A static build keeps usage minimal |
| GitHub repository | Private repo | The Vercel GitHub app needs access to it |

> ⚠️ **EMAIL WARNING: read before changing any DNS.**
> If the domain already has email, its **`MX` records** and email-related **`TXT` records** (SPF `v=spf1 …`, DKIM, DMARC `_dmarc`, provider verification) and any email `CNAME`s (e.g. `autodiscover`, DKIM selectors) **must be kept exactly as they are.**
> 1. **Export or screenshot the full DNS zone first**, before touching anything.
> 2. Only add/change the `A` record for `@` and the `CNAME` for `www`. Never delete records you don't recognise.
> 3. If you ever switch nameservers (§3.3 or §7), **recreate every MX/TXT record at the new DNS host before switching**, or email will stop working.

## 2. Vercel project setup

1. Push the repo to GitHub (`main` = production branch).
2. Vercel dashboard → **Add New… → Project → Import** the repository.
3. Framework preset: **Next.js** (auto-detected). Vercel detects `output: 'export'` and serves `/out` as static files. Build command `npm run build` (this runs the image pipeline first). Install command `npm ci`.
4. **Node.js version:** Settings → General → Node.js Version = current LTS (matches `.nvmrc` and `engines.node`).
5. **Environment variables** (Settings → Environment Variables). These are read **at build time only**:

   | Name | Production | Preview | Development | Purpose |
   |---|---|---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://example.com` | the preview URL, or leave unset (falls back to `https://$VERCEL_URL`) | `http://localhost:3000` | Canonical URLs, sitemap, OG, WhatsApp message link |
   | `SITE_ENV` | `production` | `preview` | `development` | Anything other than `production` → `robots.txt` disallows all + `<meta name="robots" content="noindex">` |

   There are no secrets. All links and contacts live in `content/site.ts`. The Cloudflare Web Analytics token (Phase 5) is public and also lives in `content/site.ts`.
6. Deploy and check the `*.vercel.app` URL.
7. Every PR gets a preview deployment, which is kept out of search engines by `SITE_ENV=preview`.
8. **Don't enable** Vercel Image Optimization, Edge Config, Vercel Analytics or Speed Insights. They're not used and would tie the site to Vercel. Analytics is Cloudflare Web Analytics (Phase 5), which works on any host.

## 3. Connect the custom domain (bare domain primary)

### 3.1 Add domains in Vercel
1. Project → **Settings → Domains → Add** → `example.com` → Add.
2. Add `www.example.com` too. When asked, choose **"Redirect to example.com"** with **308 (Permanent)**.
3. Both show **Invalid Configuration** until DNS is set. Vercel lists the exact records it expects. **Use the values shown in the dashboard**, since Vercel may display project-specific values. The long-standing generic values are below for reference.

### 3.2 Option A (recommended): keep DNS at the registrar, add two records

| Type | Host / Name | Value | TTL |
|---|---|---|---|
| **A** | `@` (bare domain) | `76.76.21.21` *(or the IP Vercel shows)* | 3600 / Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` *(or the project-specific value Vercel shows)* | 3600 / Auto |

Then:
- Remove **conflicting** records on the same names only: other `A`/`AAAA` on `@` (parking pages, old hosting) and any existing `CNAME`/`A` on `www`.
- Turn off registrar **"domain forwarding"/"parking"** features (common on GoDaddy and Hostinger).
- **Leave all `MX`, SPF/DKIM/DMARC `TXT` and email `CNAME` records untouched** (see the warning in §1).
- If a **`CAA`** record exists, add `0 issue "letsencrypt.org"` so the SSL certificate can be issued.
- If Vercel asks for a **`TXT _vercel`** verification record, add it exactly as shown.

### 3.3 Option B: move nameservers to Vercel (not recommended here)
Set the nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com`. **Before switching, recreate every existing record, especially MX/TXT for email, in Vercel → Domains → DNS Records.** This would also make a later move to Cloudflare harder, so prefer Option A.

### 3.4 Propagation & verification
```bash
nslookup example.com
nslookup www.example.com
# or
dig +short example.com A
dig +short www.example.com CNAME
dig +short example.com MX      # ← confirm email records are still there
```
Both domains turn **Valid Configuration** in Vercel. Propagation usually takes minutes, and at most 24–48 h depending on the old TTL.

### 3.5 SSL / HTTPS
- Vercel issues and auto-renews Let's Encrypt certificates for both hosts. HTTP → HTTPS is automatic.
- Check that all of these end at `https://example.com/` via 308:
  ```bash
  curl -sI http://example.com       | grep -iE "^(HTTP|location)"
  curl -sI http://www.example.com   | grep -iE "^(HTTP|location)"
  curl -sI https://www.example.com  | grep -iE "^(HTTP|location)"
  ```

## 4. After go-live

- [ ] Set production `NEXT_PUBLIC_SITE_URL=https://example.com` and `SITE_ENV=production`, then **redeploy**.
- [ ] Confirm `https://example.com/robots.txt` allows crawling and `/sitemap.xml` lists URLs on the bare domain.
- [ ] **Google Search Console:** add a *Domain property*, verify with the DNS `TXT` it provides (add it next to the existing records, without replacing any), and submit `https://example.com/sitemap.xml`.
- [ ] Check share previews (OG) by pasting a link into WhatsApp.
- [ ] Run Lighthouse on the production URLs.
- [ ] If the domain has email: send a test email to it and from it.

## 5. Ongoing workflow

| Action | Result |
|---|---|
| Merge to `main` | Production build + deploy (~1–2 min) |
| Open a PR | Preview deployment URL (noindex) |
| Bad deploy | Vercel → Deployments → previous → **Promote to Production** (instant rollback) |
| Content edit (pre-CMS) | Edit `/content/*.ts` (and images in `/assets/images/`) → PR → merge |
| Content edit (Phase 7, Sanity) | Publish in Sanity → webhook calls the host's **Deploy Hook** → static rebuild (~1–2 min) |

## 6. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Domain stays "Invalid Configuration" | Conflicting A/AAAA/CNAME still present; registrar forwarding on; host field entered as `www.example.com` where the registrar expects just `www` |
| Certificate not issuing | `CAA` without `letsencrypt.org`; DNS not propagated yet |
| Email stopped | MX/TXT records were changed or lost. Restore them from the export made in §1 |
| `/about` shows 404 but `/about/` works (or vice versa) | Expected behaviour with `trailingSlash: true` is a redirect to the slash version. Check that the host isn't overriding it |
| Old site still shows | DNS cache: `ipconfig /flushdns` (Windows), try mobile data, wait for TTL |

## 7. Moving to Cloudflare Pages

No code changes are needed. The same `npm run build` produces `/out`.

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repo.
2. Build settings: framework preset **None** (or "Next.js (Static HTML Export)"), build command `npm run build`, build output directory **`out`**. Set the `NODE_VERSION` env var to the LTS major (e.g. `22`).
3. Environment variables: `NEXT_PUBLIC_SITE_URL=https://example.com` and `SITE_ENV=production` for Production, and `SITE_ENV=preview` for Preview.
4. Deploy and check the `*.pages.dev` URL. `404.html` is served automatically for unknown paths.
5. **Custom domain:** Pages project → Custom domains → add `example.com` and `www.example.com`.
   - A **bare (apex) domain on Pages requires the domain's DNS to be on Cloudflare** (nameserver change). Add the site to Cloudflare first. Cloudflare imports existing records, but **check every MX/TXT record against your export before changing nameservers at the registrar.**
   - **www → bare redirect:** Cloudflare dashboard → Rules → **Redirect Rules** → "Redirect from WWW to root" template (301/308, preserve path and query).
6. Remove the domains from the Vercel project once Cloudflare shows them as active.
7. Optional: on Cloudflare Pages, Web Analytics can be enabled from the Pages project with one click. The beacon added in Phase 5 keeps working either way, so use just one of the two to avoid double counting.
8. Deploy hooks (for the Phase 7 CMS) exist on Pages too: Settings → Builds → **Deploy hooks**.
