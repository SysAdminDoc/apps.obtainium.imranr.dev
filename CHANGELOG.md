# Changelog

## Obtainium Apps v0.0.3 (2026-09-12)

- Put the reviewed catalog hero at the top of the README so visitors can see the product before reading setup details.
- Removed the release number from the hero and added a check that keeps the artwork evergreen.

## Obtainium Apps v0.0.2 (2026-09-09)

The fork now has its own README and a clearer catalog homepage, with the upstream identity and GPL license retained. Real website captures and the complete original source are kept in the marketing concept archive.

- Search is available from the homepage. App cards say **Add to Obtainium** and **Copy JSON**. Dark and light themes have clearer contrast.
- Removed inherited advertising accounts, analytics scripts and remote fonts. Optional statistics now mean link clicks, not installations.
- Restored the hidden LocalSend and Magic Earth records. Fixed the invalid escape in Magic Earth's configuration without changing its source URL or download settings.
- Validated every exported configuration. Malformed pagination and unsafe shared-link URLs are handled without silently dropping catalog entries.
- Shared-link pages show their source before opening Obtainium. Clipboard failures use an inline status message.
- Updated the runtime dependencies and repaired the lockfile. Builds, tests and release packages are produced locally. The inherited issue-response workflow is no longer active.

The packaged catalog has 254 listings and 378 configurations. It's a snapshot of the inherited data, not a new security review of the listed apps.
