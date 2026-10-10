## blogs feeds

- https://www.scoutshop.org/blog
  // magento 2 + hyva + amasty blog pro. no rss (probed ~13 routes, all 404) and no blog api
  // (/graphql is open but has no blog fields). /blog is a widget page fixed at 20 posts, ?p=n ignored.
  // /blog/search.html?query= works but has no pagination and no match-all.
  // only viable source is crawling /blog/category/<key>.html?p=n - 15/page with real next links,
  // ~20 categories, needs dedup. post pages have json-ld BlogPosting but the date is only in the
  // amblog-dates markup. sitemap has all 251 urls + lastmod, but post pages are ~1mb each.
  // => bespoke scraper like tta.ts, would be the most fragile adapter here.
- https://api.scouting.org/events/communications/organizations?communicationType=Announcement&everyChildOrganization=false&fromDate=2026-10-02T22%3A43%3A20&organizationGuid=3008EA8A-9822-454E-8F62-0DF19DF8100F&status=active&toDate=2026-10-02T22%3A44%3A20&perPage=20&page=1
  // the announcements shown on the my.scouting.org homepage. scouting api, requires auth
  // (bearer jwt from a my.scouting login, ~8h expiry, so a cron needs a refresh story).
  // all of communicationType, organizationGuid, fromDate, toDate, status, perPage are required.
  // full history (153 as of 2026-10-02, back to 2022-01) in one request:
  // ?communicationType=Announcement&everyChildOrganization=true&organizationGuid=3008EA8A-9822-454E-8F62-0DF19DF8100F
  // &status=all&fromDate=2000-01-01T00%3A00%3A00&toDate=2035-01-01T00%3A00%3A00&perPage=1000&page=1
  // - homepage uses a 1-minute date window around now, so it only gets what's live. widen it for history.
  // - status=active filters; any other value (all, inactive, deleted, junk) seems to disable the filter.
  // unfiltered results include deleted: "true" items, mostly dupes/corrected reposts.
  // - perPage=1000 works; page paginates normally.
  // - org 3008EA8A is "Information Delivery 5002" (50 items, recent ones). everyChildOrganization=true
  // adds "National Council, BSA 000" (F3A77C78-EE20-474E-9219-D53400753B29, 103 items, last 2026-06).
  // - communicationType is an enum: Announcement, Calendar (Calendar returns 0 for both orgs).

// find new post types on scouting.org at https://www.scouting.org/wp-json/wp/v2/types
// find new/edited pages at https://www.scouting.org/wp-json/wp/v2/pages

//todo add podcast rss feed adapter?

## defunct podcasts

- https://oa-scouting.org/article/council-fire-first-episode-2023
- https://scoutingwire.org/planning-new-post-club-listen/
- https://web.archive.org/web/20171111143924/http://www.scouting.org/Scoutcast.aspx - older episodes of CubCast / ScoutCast, + access to ExploringCast. mp3 zip and transcript downloads still available
- also check archives of podcast.scouting.org

## periodicals

- https://www.scouting.org/international/resources/
- https://www.scouting.org/commissioners/news-for-commissioners/
- https://www.scouting.org/training/training-updates/
- https://www.scouting.org/training/training-updates/archives/

## email newsletters

- https://www.ntier.org/resources/newsletter-signup/
- https://seascout.org/mailing-list/
- https://scoutingamericafoundation.org/newsletter-archive/ - these get pulled in as part of the existing Scouting America Foundation feed
- https://t.email.scouting.org/lp/LP171 //for troopleader updates
- https://ablescouts.org/subscribe/
- https://t.email.scouting.org/lp/subscribeaquatics?_uuid=d01169b6-d353-489e-a0bc-4c383a5b16b0&_test=true
- https://scoutingalumni.org/get-involved/subscribe-to-the-scouting-alumni-newsletter/
- https://scoutingalumni.org/resources/monthly-alumni-association-newsletters/

## social

- https://www.facebook.com/theboyscoutsofamerica
- https://x.com/boyscouts
- https://www.facebook.com/oalodgemaster
- https://x.com/oalodgemaster
- https://www.youtube.com/channel/UCRtvk_XdyZHqDOYkBW04uZg

## marketing / landing pages

- https://stg.scouting.org/
- https://councils.scouting.org/
- https://arbsaf2018.scouting.org/bsa-foundation-annual-report-2018-home/
- https://ar2018.scouting.org
- https://ar2019.scouting.org/
- https://www.bsarestructuring.org/
- https://nylt-leadershipacademy.org/

## reference and guidance

## tools

- https://assets.scouting.org/
- https://directory.scouting.org/alumni-dashboard
- https://id.oa-scouting.org/
- https://registration.oa-scouting.org/
- https://members.oa-scouting.org/
- https://portal.oa-scouting.org/
- https://jira.oa-scouting.org/
- https://oalodgemaster.featureupvote.com/
- https://api.scouting.org/organizations/v2/zip/12345/council
- https://global.scoutingevent.com/

## other

- https://www.myscoutshop.org/
- https://open.spotify.com/show/57YZ4Fu74WkSHE5qyVkQS2
- https://filestore.scouting.org/filestore ... figure out how to list everything or see updates?
- https://hrgateway.intranet.mybsa.org/
  // bsa hr intranet, wordpress. site needs a login to browse, but the rest api is public:
  // /wp-json/wp/v2/posts (53) and /pages (138) as of 2026-09-24. could work with the wordpress adapter.

give.scouting.org
reservations.scouting.org
connect.scouting.org

rssbridge
rsshub

## scout life

- https://mediakit.scoutlife.org/
- https://headsup.scoutlife.org/
- https://scoutlife.org/peewee/
- https://scoutlife.org/wacky-adventures/
- https://scoutlife.org/scouts-in-action/
- https://jokes.scoutlife.org/
- https://fishing.scoutlife.org/

## high adventure bases

- https://summiteventswv.com/
- https://jamboreg.scouting.org/

dimensions

- type
  - blog
  - social
  - marketing / landing page
  - reference and guidance
  - tools
  - email newsletter
- topic
  - scout shop
  - philmont
- feed types
  - rss
  - facebook
  - instagram
  - twitter
  - youtube

## third-party blogroll

- https://scouterstan.org/
- https://mikecooney.net/
- https://markaray.wordpress.com/
- https://modernscouting.wordpress.com/
- https://scoutingmaverick.com/
- https://web.archive.org/web/20220518095928/https://scoutmastercg.com/category/scout-leader-skills/
- https://mrsscoutmaster.com/
- https://scoutmastercg.com/
- https://scoutsmarts.com/
- https://middletownscouter.wordpress.com/
- https://www.melrosetroop68.org/blog/

## third party tools and resources

- https://www.scouter.com
- https://scoutingamericasquareknots.app/
- https://scoutbugle.com/
- https://scoutpioneering.com/
