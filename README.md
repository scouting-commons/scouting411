<div align="center">

# 📰 Scouting411

**The unofficial aggregator for official Scouting America news and resources.**

[![CI](https://github.com/scouting-commons/scouting411/actions/workflows/check.yaml/badge.svg)](https://github.com/scouting-commons/scouting411/actions/workflows/check.yaml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

[**🌐 scouting411.org**](https://scouting411.org) · [🔌 API docs](https://scouting411.org/api) · [🤖 MCP server](https://scouting411.org/integrations#mcp-server) · [Request a resource](https://github.com/scouting-commons/scouting411/issues/new/choose)

</div>

> [!IMPORTANT]
> **Scouting411 is unofficial.** It is a [Scouting Commons](https://github.com/scouting-commons) community project and is not affiliated with, endorsed by, or speaking for Scouting America. Everything it shows comes from Scouting America's own national publications, and each item links back to its source. For authoritative information, always refer to [scouting.org](https://www.scouting.org).

## 🏕️ Why

Scouting America publishes across dozens of blogs, newsrooms, podcasts, and program pages. Scouting411 gathers the national, first-party sources into one place, so volunteers can keep up without checking each one, and without wading through council mirrors and stale forum threads.

## 🧭 What's inside

| Section                                            | What it is                                                                                                                                                                                                                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**News**](https://scouting411.org/news/browse)    | Posts from about 30 official national sources (program updates, Scouting Wire, Scout Life, the OA, Sea Scouts, NESA, podcasts, and more), refreshed daily. Filter by source, search, and subscribe.                                                              |
| [**Resources**](https://scouting411.org/resources) | A hand-picked directory of useful national resources for volunteers.                                                                                                                                                                                             |
| **Advancement**                                    | Requirements for [ranks](https://scouting411.org/advancement/ranks), [merit badges](https://scouting411.org/advancement/merit-badges), and [Cub Scout adventures](https://scouting411.org/advancement/adventures), from Scouting America's own advancement data. |
| **Hubs**                                           | One page per program (Cub Scouts, Scouts BSA, Sea Scouts, the Order of the Arrow, and more) collecting its news and resources.                                                                                                                                   |
| **System status**                                  | Live status of national systems like my.Scouting and Scoutbook.                                                                                                                                                                                                  |

Press <kbd>Ctrl</kbd>+<kbd>K</kbd> anywhere on the site to search it, or add Scouting411 as a search engine in your browser.

## 🔌 Use the data

Everything on the site is open for reuse:

- **Feeds.** Every source is re-published as [RSS, Atom](https://scouting411.org/integrations#rss-feeds), and a single OPML file, so you can follow along in any feed reader.
- **REST API.** A public, CORS-enabled API with an OpenAPI spec and interactive docs at [scouting411.org/api](https://scouting411.org/api). See [developers](https://scouting411.org/developers) for more.
- **MCP server.** Connect Claude or any MCP client to `https://scouting411.org/mcp` to search news, look up requirements, and check system status. Setup steps are on the [MCP server page](https://scouting411.org/integrations#mcp-server).

## Adding a Resource

Know a national resource that belongs in the directory? [Open an issue](https://github.com/scouting-commons/scouting411/issues/new/choose). To be included, a resource must:

- be an official publication of Scouting America at the national level (no council, district, unit, or third-party publications)
- be useful or noteworthy for Scouting volunteers
- stand on its own, not be one part of a larger set (for example, one post in a blog series, or one article in a collection of resources)
- be the current version, not an older version of a resource that has since been updated
- not be an individual document, such as a merit badge pamphlet or an award application form

## 🛠️ Development

Scouting411 is built with [Astro](https://astro.build), React, and Tailwind, deployed on Vercel. A daily cron job pulls every upstream source into Postgres (news) and Redis (advancement), and pages only ever read from those stores.

```sh
pnpm install
pnpm dev
```

You'll need a `.env` with `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `CRON_SECRET`. Before opening a pull request, run `pnpm check` (type check, format, lint, and knip). If you touched resources, also run `pnpm validateResourceLinks`.

[`CLAUDE.md`](CLAUDE.md) has a full tour of the architecture.

## 🤝 Contributing

Bug reports, feature ideas, resource requests, and pull requests are all welcome on the [issue tracker](https://github.com/scouting-commons/scouting411/issues/new/choose). To report a security issue, see [SECURITY.md](SECURITY.md). Our [code of conduct](https://github.com/scouting-commons/.github/blob/main/CODE_OF_CONDUCT.md) is short: follow the Scout Oath and Scout Law.

---

<div align="center">

<sub>Scouting411 is an independent community project and is not affiliated with or endorsed by Scouting America. Licensed under [AGPL-3.0](LICENSE).</sub>

<sub>_Be Prepared. Do a Good Turn Daily._</sub>

</div>
