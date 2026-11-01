# Status — storyrings-website

Marketing site for Storyrings. Plain HTML/CSS/JS, served from GitHub Pages at
<https://lunasmedia.github.io/storyrings-website/>. No build step.

Pages: `index.html`, `platform.html`, `developers.html`, `use-cases.html`, `contact.html`,
`404.html`, with shared `styles.css` and `main.js`.

The homepage embeds the real web SDK below the hero (`#live-stories`), loaded from
`https://stories-dashboard.fly.dev/sdk/v1/stories.js`.

## Sources of truth

Never describe the SDK from memory. Check it against the SDK repo:

| Claim on the site | Where it is defined |
|---|---|
| Web / React code samples, option names | [`docs/web-sdk.md`](https://github.com/lunasmedia/storyrings/blob/main/docs/web-sdk.md) |
| iOS sample | [`docs/ios-sdk.md`](https://github.com/lunasmedia/storyrings/blob/main/docs/ios-sdk.md) |
| Android sample | [`docs/android-sdk.md`](https://github.com/lunasmedia/storyrings/blob/main/docs/android-sdk.md) |
| Platform support table | [SDK `README.md`](https://github.com/lunasmedia/storyrings/blob/main/README.md) |

## Done

- [x] **P0 — website matches the real SDK.** Every code sample, the platform support table and
      the options tables now come from the SDK docs rather than from an invented API.
  - [x] `main.js` code samples: real script URL, `Stories.init({ token })` + `mount()`,
        `@lunasmedia/storyrings-react` / `StoriesBar`, real Swift and Kotlin calls.
  - [x] `developers.html` quick start step 3 names `Stories.init` and `mount`.
  - [x] Platform support table matches the SDK README exactly (Website, React,
        React Native / Expo and iOS available; Android and Flutter coming soon).
  - [x] Options split into three tables that mirror the docs: `Stories.init(options)`,
        `client.mount(target, options)` and the callbacks. The invented `container` option is gone.
  - [x] Placeholders resolved (board decision, 2026-11-01): "Log in" points at
        <https://stories-dashboard.fly.dev>, footer "Docs" points at the SDK guides,
        the contact form sends to `hello@storyrings.io`, and the dead Privacy / Terms
        links are removed until real pages exist. No `href="#"` is left on any page.
  - [x] Brand name is "Storyrings" in all prose. The one remaining `StoryRings` is the Swift
        module name in the iOS sample, kept deliberately (see Blockers).
  - [x] Availability claims outside the platform table now agree with it: the homepage hero
        chips, the "Which platforms are supported?" answer on `contact.html`, and the
        "Platform support" subtitle in every page's Developers menu.

## Known issues

- **No CI.** This repo has no `.github/` directory, so nothing is checked on push. An HTML/link
  validation workflow would catch dead links and broken markup before they ship.
- **Contact form has no backend.** `#accessForm` builds a `mailto:` link, so submitting it
  depends on the visitor having a mail client. A real form endpoint is a P4 item and needs a
  human to pick a provider.
- **`hello@storyrings.io` is a placeholder.** There is no storyrings domain or mailbox yet, so
  mail sent from the contact form currently goes nowhere.
- **No Privacy or Terms pages.** The footer links were removed rather than pointed at stubs.
  UK GDPR applies; these need a human to write them.
- **No docs site.** The six SDK guides exist in the SDK repo but have no published home, so the
  footer "Docs" link goes to GitHub. A real docs site is the proposed next task.
- **No Lighthouse / SEO pass yet.** Open Graph images, a sitemap and a mobile performance
  budget are all still P4.

## Next

- Publish the SDK guides as a real docs site and repoint the footer "Docs" link at it.
- Add a CI workflow (link check + HTML validation) so the quality bar is actually enforced.
- P4 website polish: Lighthouse 90+ on mobile, Open Graph images, sitemap.

## Blockers

- **Swift module casing.** The board chose "Storyrings" as the brand name, but `StoryRings` is
  the Swift library and module name in the SDK repo (`import StoryRings`, the `Package.swift`
  targets, `Sources/StoryRings/`). Renaming it is a breaking change to the public iOS API, so it
  is deliberately *not* part of the casing cleanup and needs its own decision and version bump.
  Prose was changed; identifiers were not.
