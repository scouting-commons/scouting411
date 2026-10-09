# AGENTS.md

Scouting411 (scouting411.org) is an Astro + React site that aggregates official Scouting America news, advancement data, and resources.

## Working here

- `pnpm check` is the gate (astro check, prettier write, eslint, knip). A change is done when it passes.
- Knip runs with `--treat-config-hints-as-errors`, so an unused export, file, or dependency fails the check. Remove whatever a refactor orphans in the same change.
- After touching `src/lib/resources/config.ts`, run `pnpm validateResourceLinks`. CI skips it.
- There are no unit tests. Verify against `pnpm dev`, or drive the API from the Scalar docs at `/api`.

## Cron writes, pages read

News (Postgres) and advancement (Redis) share one rule: a daily Vercel cron (`vercel.json`) fetches upstream and writes storage, and a page request only reads storage. The cron routes in `src/pages/api/` check a `Bearer ${CRON_SECRET}` header. System status is the one exception.

Any page or route that reads Redis or the database must `export const prerender = false`.

## News: `src/lib/news/`

Three folders that meet only at the Postgres `posts` table: `feeds/` (config), `ingest/` (cron writes), `query/` (page reads). `post.ts` holds the shared `Post` type.

### Feeds

`feeds/config.ts` is the source of truth: every feed in one `const satisfies FeedConfig[]`, whose literal type drives `FeedSlug`, so adding a feed propagates types everywhere. Read an entry's `todo` notes before concluding a source is missing by oversight. `context/notes.md` lists candidate sources not yet built.

`feeds/feed.ts` hydrates configs into the alphabetized `feeds` array with each feed's canonical `links`. Link to `feed.links.*` rather than rebuilding those paths.

**Cycle trap:** `feed.ts` imports `query/queryParams.ts` to build `links.browsePosts`. So `queryParams.ts` and everything it imports (`query/types.ts`, `filter.ts`, `sort.ts`) take feed data from `feeds/config.ts` and `feeds/types.ts` only. Importing `feed.ts` there closes a cycle that typechecks but breaks island hydration with a TDZ error at runtime. `read.ts` and `query.ts` sit outside the cycle and may import `feed.ts`.

### Ingest

`ingestAllFeeds.ts` runs every feed concurrently with `Promise.allSettled`, so a bad upstream fails only its own feed. Per feed, `ingestFeed.ts` runs the adapter and passes its output through `normalize.ts`, the zod schema that enforces what `PostData` claims (HTML stripped, entities decoded, http(s) URLs, ISO dates). Zero posts counts as a failure, so an empty upstream writes nothing. `store.ts`'s `insertPosts` appends with `onConflictDoNothing` on feed and url, so the table keeps every post ever seen, including ones gone from upstream.

`adapters/` holds one adapter per upstream shape, each a `FeedAdapter` from `ingest/types.ts`. A new upstream shape gets a new adapter.

The `posts` table is in `src/lib/db/schema.ts` (Drizzle over Neon). Its `feed_slug` column is a Postgres enum built from the feed config, so adding, renaming, or removing a feed needs a migration: `pnpm db generate`, then `pnpm db migrate`. Delete a removed feed's rows first (Postgres can't drop an enum value in use), and hand-edit a rename into `ALTER TYPE feed_slug RENAME VALUE`.

### Query

`query.ts`'s `queryPosts(input)` is the single read path: resolve, `read.ts` (one query over the selected feeds), filter, sort, paginate. Callers reach it through the `news.posts.query` procedure. `feeds/consumerOutput.ts` calls it directly because lib sits below the router.

Input is **sparse**: every field optional, nothing filled in. Defaults live only in `resolve.ts`, which `queryPosts` applies itself, so callers pass just what they care about. Absent and empty `feeds` both mean every feed. `paginate: false` returns every match as one page.

`queryParams.ts` encodes the sparse input to and from URL params, so browse URLs record only what the user touched. Read its header comment before changing the `qs` options.

The browse page (`src/pages/news/browse/`) decodes params server-side and hands off to its `_index.tsx` island, which owns the query in state and mirrors it to the URL. The island's effect has a stale-response guard so an older, slower query can't overwrite a newer one. Keep it when editing the effect.

`src/pages/feeds/` re-publishes stored posts as RSS, Atom, and OPML.

## Advancement: `src/lib/advancement/`

Official advancement data from the Scouting America API (`api.scouting.org/advancements`), one folder per type (`meritBadges/`, `ranks/`, `adventures/`, `awards/`). Each has an `upstream.ts` that fetches and normalizes and an `ingest.ts` that writes the list to `advancement:{type}` and each item's requirements to `advancement:{type}:{slug}`, isolating failures per item. `src/pages/api/updateAdvancement.ts` ingests every type in parallel.

Requirements:

- `requirements.ts` holds only the `Requirement` schema. Parsing and sanitizing live in `parseRequirements.ts`, imported only by ingest code. `sanitize-html` stays out of `requirements.ts`: pages, search, and islands reach that file through each type's `types.ts`, and `sanitize-html` crashes on Vercel (`ERR_REQUIRE_ESM` via `htmlparser2`).
- Upstream sends requirements as a flat list in unreliable order. `orderRequirements` sorts siblings by `sortOrder` **as a decimal** ("1.05" < "1.1").
- Requirement text is HTML, sanitized at ingest and rendered with `set:html` by `src/components/advancement/Requirements.astro`.
- A type-specific field (a merit badge's `counselorApproval`) is added to `upstreamRequirementSchema` with `.extend` and passes through `orderRequirements`.

Per-type quirks:

- **Ranks:** upstream lists a rank once per version in use (Sea Scouting runs two during a transition). Entries are merged by id, each version's requirements are fetched with `?versionId=`, and a rank carries `versions` newest first. The rank page picks one with `?version=`.
- **Adventures:** upstream mixes in retired programs with no expiry date, so `upstream.ts` keeps only `programVersion` (2024). Bump it when a new program ships. Adventures return real numbers and nulls, which `upstream.ts` converts to the strings `parseRequirement` expects.
- **Awards:** fetched through the `@scouting-commons/scouting-api` client rather than `fetchUpstream`. Only the newest requirements version is kept. About half have no requirements and some have no art, so an empty list and missing `images` are normal.

## System status: `src/lib/status/`

`status.ts` reads the Uptime Kuma instance behind status.scouting.org (not Statuspage, so the news adapter doesn't apply). It is the one exception to "pages only read storage": a day-old status is useless, so it's read live and memoized for a minute. The homepage fetches it after mount so a slow status page never blocks the render.

## Resources

`src/lib/resources/config.ts` is a hand-maintained `Resource[]`. Apply the inclusion criteria in `README.md` as written. They are stricter than they look: national-level official publications only, whole series rather than single items, current versions, no individual forms. Requests arrive as GitHub issues via `.github/ISSUE_TEMPLATE/`.

## Search: `src/lib/search/`

One search over the site's named things (pages, hubs, feeds, resources, advancement), shared by the command palette, the `/search` page, the browser search provider, REST, and MCP. It matches names only: news posts and requirement text are out of scope by design (news has `query_posts` and the browse page).

- `SearchItem` (`types.ts`) is plain serializable data so it crosses the wire to islands, REST, and MCP.
- `sources.ts` is the registry, one function per source, in tie-break order. It is **server only** (the advancement sources read Redis). Register a new kind of item there, then give it a label and icon in `searchItemTypes` (`src/components/react/searchItem.tsx`).
- `search.ts`'s `searchItems` is pure and browser-safe. The palette fetches `search.items` once on mount and searches locally; everything else calls `search.query`.

A leading `!` on `/search` launches the top result (`!camping` opens the Camping merit badge). `src/pages/search/suggest.ts`, the OpenSearch suggestions endpoint, is deliberately a plain route rather than a procedure: browsers dictate its positional-array shape, so it stays out of the published API.

## API: `src/rpc/`

One oRPC router is the backend for islands, SSR pages, the MCP tools in `src/mcp/tools/`, and the public REST API. oRPC is on the **v2 beta** (exact-pinned), so check docs against v2.

- A procedure is a thin wrapper over `src/lib`. Lib code imports nothing from `src/rpc/`, which would close a cycle (router → procedure → lib → client → `ssrClient.ts` → router).
- Callers import `rpc` from `@/rpc/client` on server and client alike. During SSR it calls the router in process through `ssrClient.ts`; in the browser it calls `/rpc`. Keep the router import in `client.ts` type-only, so the router (and Redis and the database with it) stays out of island bundles.
- The in-process client is shared across requests, so procedures get no per-request context. When one needs it (auth), pass context per call or build a client per request in middleware on `Astro.locals`.

Two handlers serve the router: `src/pages/rpc/[...path].ts` (RPC protocol, islands only) and `src/pages/api/[...path].ts` (public REST, CORS `*`, plus the spec at `/api/spec.json` and Scalar docs at `/api`). Treat the REST shape as a published contract. Paths come from `.meta(openapi({ method, path }))`; `method` defaults to POST. A specific file under `src/pages/api/` silently shadows any procedure at the same path, so only the two cron routes live there.

The feed re-publishing routes are documented by hand in `src/rpc/openapi/feedPaths.ts`. Update it when those routes change.

## Conventions

- A page's own React island sits beside it with a `_` prefix (`_index.tsx`, `_filterSidebar.tsx`). Cross-page islands go in `src/components/react/`, the page frame (head, layouts, sidebar) in `src/components/layout/`.
- Pages wrap their content in `Layout.astro` and supply `title`.
- `src/components/ui/` is shadcn/ui on `@base-ui/react` (not Radix). Add components with the `shadcn` CLI so they match `components.json`.
- Tailwind v4: the theme lives in `src/global.css` (there is no `tailwind.config`). Fonts are declared in `astro.config.ts` via Astro font providers.
- Write imports as full `@/` paths (`@/*` → `src/*`), even within the same directory.
- Server env vars are schema-validated in `astro.config.ts` and imported from `astro:env/server`. Local values live in a gitignored `.env`.
- `trailingSlash: "never"`: write internal links without a trailing slash.
