# AGENTS.md

Scouting411 (scouting411.org) is an Astro + React site that aggregates official Scouting America news and resources. Two content systems: a **news aggregator** (a cron-refreshed cache of external Scouting feeds, browsable and filterable) and a **resources directory** (a hand-maintained list of official links).

## Working here

Package manager is pnpm; scripts live in `package.json`.

- `pnpm check` is the gate — `astro check`, prettier write, eslint, knip. A change is done when it passes, not before.
- Knip runs with `--treat-config-hints-as-errors`: an unused export, file, or dependency fails the build. Remove dead exports as part of the refactor that orphans them.
- `pnpm validateResourceLinks` fetches every URL in `src/lib/resources/config.ts`. Run it after touching resources; CI runs it too.
- There is no unit test framework. Verify against `pnpm dev`, or drive the API by hand from the Scalar docs at `/api`.

## News: ingest, cache, query

Three layers that meet only at the Redis cache. **A page request never fetches upstream** — it only reads Redis.

### Feed config is the source of truth

`src/lib/news/feeds/config.ts` holds every feed as a `const satisfies FeedConfig[]`, so the literal type drives `FeedSlug` (a `z.enum` in `feeds/types.ts`) and adding a feed propagates types everywhere. Entries carry `todo` notes explaining why a candidate source is broken, paginated badly, or unavailable — read them before concluding a feed is missing by oversight. `context/notes.md` is the scratchpad of candidate sources not yet built.

`feeds/feed.ts` hydrates configs into the alphabetized `feeds` array and assigns each feed its canonical `links` (overview, browsePosts, rss, atom). Link to `feed.links.*` rather than rebuilding those paths.

**The cycle trap:** `feed.ts` imports `query/queryParams.ts` to build `links.browsePosts`. So the query layer takes `feedSlugs` from `feeds/types.ts`, not `feeds/feed.ts` — importing it from `feed.ts` closes a cycle back through `queryParams.ts` and breaks island hydration with a TDZ error at runtime, which typecheck will not catch. Keep the query layer importing from `feeds/config.ts` and `feeds/types.ts` only.

### Ingest (cron only) — `src/lib/news/ingest/`

One adapter per upstream type in `upstream/adapters/` (`rss.ts` via feedsmith, `wordpress.ts` REST, `statuspage.ts`, `podcast-archive/`), each implementing `FeedAdapter` from `upstream/types.ts`. New upstream shape means a new adapter, not a special case inside an existing one.

`upstream/ingestFeed.ts` runs one feed's adapter and pipes the output through `upstream/normalize.ts` — a zod schema that strips HTML, decodes entities, pins URLs to http(s), and coerces each upstream's date format to an ISO string. Adapters return raw-ish data; normalize enforces the invariants `PostData` claims.

`execute/ingestAllFeeds.ts` runs every feed concurrently and isolates failures per feed, so one bad upstream cannot abort the run. **Zero posts counts as a failure** and the existing cache is left in place. Its only caller is `src/pages/api/updateAllFeeds.ts`, a daily Vercel cron (`vercel.json`) guarded by a `Bearer ${CRON_SECRET}` header.

### Cache — `src/lib/news/cache/`

`cache.ts` is the whole Redis surface: JSON read/write at key `posts:{slug}`. `fetch.ts` reads one key per selected feed and hydrates `PostData` into `Post` with its `Feed` attached. Route new post access through the query layer rather than calling `fetch.ts` directly.

### Query — `src/lib/news/query/`

`query.ts`'s `queryPosts(input)` is the single entry point: resolve → fetch selected feeds → `filter.ts` → `sort.ts` → `paginateArray`. Input is **sparse**: `types.ts`'s `queryInputSchema` makes every field optional and fills in nothing. Defaults live only in `resolve.ts`'s `resolvedQuerySchema`, which `queryPosts` applies internally — callers pass just what they care about, and never spell out defaults. Absent and empty `feeds` both mean every feed. `paginate: false` returns every match as one page.

`queryParams.ts` encodes the sparse input to and from URL search params via `qs`, so browse URLs record only what the user touched. Its header comment explains why `arrayFormat: "brackets"` and `arrayLimit` are load-bearing — read it before changing those options.

Callers reach `queryPosts` through the `news.posts.query` procedure (see **API** below). The one exception is `src/lib/news/feeds/consumerOutput.ts`, which calls it directly because lib code sits below the router.

Re-publishing routes: `src/pages/feeds/[slug]/rss.ts` and `atom.ts` serve one source's cached posts; `feeds/all/opml.ts` lists them all.

### The browse island

`src/pages/news/browse/index.astro` decodes URL params server-side into `initialQuery`, then hands off to the `client:load` React island `_index.tsx`, which owns the sparse query in `useState` and pushes it back to the URL with `history.replaceState`. The sidebar form holds that same sparse input; an untouched field is `undefined` and displays its resolved value.

That island's effect holds a **stale-response guard**: a narrow query resolves faster than a broad one (one Redis read per selected feed), so an in-flight broad query can otherwise land last and clobber a narrow one. Preserve it when editing the effect.

## Advancement — `src/lib/advancement/`

A reference of official advancement data from the Scouting America API (`api.scouting.org/advancements`). Merit badges, ranks, Cub Scout adventures, and awards are built. Same rule as news: the cron ingests into Redis, pages only read it.

- `upstream.ts`, `requirements.ts`, and `parseRequirements.ts` are shared across advancement types. `requirements.ts` holds only the `Requirement` schema; the parsing and sanitizing live in `parseRequirements.ts`, which only the ingest side imports. Keep `sanitize-html` out of `requirements.ts`: pages and the search sources reach it through each type's `types.ts`, so an import there loads `sanitize-html` on every SSR page that touches advancement (and into the browser bundle of any island that imports those types), and it crashes on Vercel (`ERR_REQUIRE_ESM`: it `require()`s the ESM-only `htmlparser2`). Requirements come upstream as a flat list; `orderRequirements` sorts siblings by `sortOrder` **as a decimal** ("1.05" < "1.1", "3.09" < "3.1") because upstream array order is unreliable. Requirement text is hand-written HTML, run through `sanitizeRequirementHtml` and rendered with `set:html` by `src/components/advancement/Requirements.astro`. `upstreamRequirementSchema` and `parseRequirement` cover the fields every type shares; a type-specific field (a merit badge's `counselorApproval`) is added with `.extend` and passes through `orderRequirements`.
- `meritBadges/` — `upstream.ts` fetches and normalizes, `ingest.ts` writes the list to `advancement:meritBadges` and each badge's requirements to `advancement:meritBadges:{slug}`, isolating failures per badge. Callers reach them through the procedures under `advancement.meritBadges` in the router.
- `ranks/` — same shape, keys `advancement:ranks` and `advancement:ranks:{slug}`. Upstream lists a rank once per version in use (Sea Scouting runs two during a transition), so entries are merged by id and each version's requirements are fetched with `?versionId=`. A rank carries `versions`, newest first, each with its own header/footer notes; the rank page picks one with `?version=`.
- `adventures/` — same shape, keys `advancement:adventures` and `advancement:adventures:{slug}`. Upstream mixes retired programs into the list with no expiry date, so `upstream.ts` keeps only `programVersion` (2024) — bump it when a new program ships. Unlike the other types, adventures return real numbers and nulls, which `upstream.ts` converts to the strings `parseRequirement` expects. The list procedure takes an optional rank slug.
- `awards/` - same shape, keys `advancement:awards` and `advancement:awards:{slug}`. The only type fetched through the `@scouting-commons/scouting-api` client rather than `fetchUpstream`. Every award upstream lists is included, retired and historical ones too, and only its newest requirements version is kept. About half have no requirements upstream, so an empty list is a normal case, and some have no art, so `images` is optional.
- The cron route is `src/pages/api/updateAdvancement.ts`, which ingests every type in parallel, alongside `updateAllFeeds.ts` in `vercel.json`.

## System status — `src/lib/status/`

`status.ts` reads the Uptime Kuma instance behind status.scouting.org (not Statuspage, so the news adapter doesn't apply). It is the one deliberate exception to "pages never fetch upstream": a day-old status is useless, so it's read live and memoized for a minute per instance. Exposed as `status.get` (REST `GET /api/status`) and the MCP `get_system_status` tool; the homepage fetches it after mount for the dot in the System Status chip, so a slow status page never blocks the render.

## Resources

`src/lib/resources/config.ts` is a hand-maintained `Resource[]`. Inclusion criteria are in `README.md` — apply them as written; they are stricter than they look (national-level official publications only, no single item from a series, no superseded versions, no individual forms). Requests arrive as GitHub issues via `.github/ISSUE_TEMPLATE/`.

## Search — `src/lib/search/`

One search over the site's named things — pages, hubs, feeds, resources, ranks, merit badges, adventures — shared by the command palette, the `/search` page, the browser search provider, the REST API, and the MCP `search` tool. It matches names, not content: **news posts and requirement text are deliberately out of scope** (news has `query_posts` and the browse page).

- `types.ts` — `SearchItem`, plain serializable data (no icons or callbacks) so it crosses the wire to islands, REST, and MCP.
- `sources.ts` — the registry: one function per source, in the order ties break. **Server only**: the advancement sources read Redis, so never import it from an island. Add a new kind of item here, then give its type a label and icon in `searchItemTypes` (`src/components/react/searchItem.tsx`), which the palette and results page share.
- `search.ts` — `searchItems(items, query)`, pure and browser-safe. cmdk's fuzzy scorer, with a name match counting in full and keyword/description matches at 0.8×, so an item named for the query outranks one that mentions it; matches under 0.1 are dropped. It's generic over anything with `name`/`keywords`/`description`, which is how the palette ranks its local theme commands with the same scorer.

Procedures `search.items` (every item, for local search) and `search.query` (ranked). The palette fetches `search.items` once per page load, on mount, and searches locally; everything else calls `search.query`.

The `/search` page is server-rendered and redirects to `/` without a query. A leading `!` launches the top result instead of listing results (`!camping` → the Camping merit badge); with no match it falls through to the results page. Browser integration: `src/pages/opensearch.xml.ts` (linked from `Head.astro`) and `src/pages/search/suggest.ts`, the OpenSearch suggestions endpoint. The suggestions route calls `rpc.search.query` but is deliberately **not** a procedure — browsers dictate its positional-array shape, so it stays out of the published API and the spec.

## API — `src/rpc/`

One oRPC router is the backend boundary for islands, SSR pages, the MCP tools in `src/mcp/tools/`, and the public REST API. oRPC is on the **v2 beta** (exact-pinned); v1 docs and examples do not match its API.

- `router.ts` assembles the procedures in `procedures/`. A procedure is a thin wrapper over `src/lib`; logic lives in lib. Lib code imports nothing from `src/rpc/` — it would close a cycle (router → procedure → lib → client → `ssrClient.ts` → router).
- **Callers** import `rpc` from `@/rpc/client`, on server and client alike. Under `import.meta.env.SSR` it loads `ssrClient.ts`, which registers an in-process router client on `globalThis.$client`, so SSR never makes HTTP calls; in the browser that import is stripped and calls go to `/rpc`. Keep the router import in `client.ts` type-only — a value import bundles the router, and Redis with it, into every island.
- `$client` is shared across requests, so procedures get no per-request context. Astro has no request-scoped store: when a procedure needs one (auth), pass context per call or build a client per request in middleware on `Astro.locals`.

Two handlers serve the same router:

1. `src/pages/rpc/[...path].ts` — the RPC protocol, for islands only.
2. `src/pages/api/[...path].ts` — REST, public, CORS `*`. Treat its shape as a published contract. Also serves the spec at `/api/spec.json` and Scalar docs at `/api`, which `/developers` links to.

REST paths come from `.meta(openapi({ method, path }))` on each procedure; `method` defaults to POST, and a procedure without a path gets one derived from its router key. A specific file under `src/pages/api/` outranks the catch-all, so it silently shadows any procedure at the same path — the cron routes `updateAllFeeds.ts` and `updateAdvancement.ts` are the only ones that belong there.

The feed re-publishing routes are plain Astro routes, documented by hand in `openapi/feedPaths.ts` (merged into the spec as `base.paths`, with a per-path `servers` override so they resolve at the site root). Update it when those routes change.

## Conventions

- Routes are `.astro` files under `src/pages/`. Files prefixed with `_` (`_index.tsx`, `_filterSidebar.tsx`) are that page's React island, colocated with it — follow this for new page-specific components. Cross-page islands go in `src/components/react/`, chrome in `src/components/layout/`.
- **Any page or route that reads Redis must `export const prerender = false`.**
- `Layout.astro` wraps `RootLayout.astro` plus the `AppShell` island (sidebar, command palette, dark mode); pages supply `title` and children.
- `src/components/ui/` is shadcn/ui, style `base-vega`, icons `lucide`, built on `@base-ui/react` (not Radix). Add components with the `shadcn` CLI so they match `components.json`. Knip ignores unused exports here.
- Tailwind v4 via `@tailwindcss/vite` — there is no `tailwind.config`; the theme lives in `src/global.css`. Fonts are declared in `astro.config.ts` via Astro font providers, not imported in CSS.
- Path alias `@/*` → `src/*`. Write imports as full `@/` paths even within the same directory — match the surrounding files.
- Prettier uses **tabs**, with the Tailwind class-sorting plugin.

## Env and deployment

Server env vars are schema-validated in `astro.config.ts` and imported from `astro:env/server`: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CRON_SECRET`. Local values live in a gitignored `.env`. Deployed to Vercel via `@astrojs/vercel` (`maxDuration: 300` for the feed-update function). `trailingSlash: "never"`.
