# Host Obtainium Apps v0.0.3

This fork runs as a Node.js website. It doesn't contain the Obtainium Android app or any APKs. The official catalog at apps.obtainium.imranr.dev is a separate upstream service.

## Run the source

Install Node.js 22.12 or newer. Node.js 24 is used for local release checks.

```sh
npm ci
npm test
npm run typecheck
npm run build
npm start
```

Open [127.0.0.1:8080](http://127.0.0.1:8080). The server binds to your machine only. For development, use `npm run dev` at the same address. The data validator is read-only and doesn't contact app sources.

To run the prebuilt server ZIP, extract it, open a terminal in its folder, run `npm ci --omit=dev`, then `npm start`. Keep `public/data`, `dist`, `package.json` and the lockfile together. Don't rebuild that smaller package; use the source ZIP for changes.

## Put it behind HTTPS

Set `HOST` and `PORT` before starting the server. Use `HOST=0.0.0.0` only when a reverse proxy or container needs to reach it. That setting exposes the service beyond localhost. Set up TLS at your proxy, forward the original host, and limit request sizes and rate of access there.

Example in PowerShell:

```powershell
$env:HOST = '127.0.0.1'
$env:PORT = '8080'
npm start
```

The app doesn't need a database or an account. Its catalog comes from the JSON files in `public/data/apps`. Restart the server after changing those files. Rebuild when changing source, styles or build-time environment variables.

The API is `GET /api/apps`. It accepts `q`, `category` (repeatable), `categories` (comma-separated), `categoryMode`, `type`, `sort`, `page` and `limit`. Limits run from 1 to 200; the default is 50. Search matches literal text in the name, author or description. It is not a regular-expression search.

## Privacy and optional statistics

No advertising, analytics scripts or remote fonts are included. App icons still load directly from the third-party URLs in the catalog. Those hosts receive image requests and the visitor's IP address. Images use a no-referrer policy and fall back to initials when unavailable. The catalog doesn't download APKs itself.

Statistics are disabled by default. If you have an existing public Plausible statistics endpoint for a site you control, set both of these variables before building:

```dotenv
PUBLIC_PLAUSIBLE_API_BASE_URL=https://stats.example.org
PUBLIC_PLAUSIBLE_SITE_ID=catalog.example.org
```

This reads aggregated outbound-link clicks from that endpoint. It does not add visitor tracking to the website, and a click is not proof of an installation. Don't enter an API secret in a `PUBLIC_` variable. Failed statistics requests fall back to cached counts or no counts. Use the source package to build your configured copy.

Language comes from `?lang=en`, `fa`, `ru`, `de`, `ja` or `zh`, then the browser preference. Missing translations fall back to English. Dark is the default theme. The theme switch stores only the local preference in the browser.

## Shared links

The catalog exports `obtainium://app/<encoded JSON>` links. Obtainium must be installed on Android to handle them. The `/redirect?r=...` page accepts an app configuration or an `obtainium://add/<encoded URL>` source link. This fork shows the source and waits for an explicit **Add to Obtainium** click. It does not launch an external application automatically.

The redirect page rejects malformed JSON, non-HTTP sources and URLs containing credentials. It isn't a malware scanner. Review the app and its source before importing a configuration. See the [upstream deep-link documentation](https://wiki.obtainium.imranr.dev/deep_links/) for Android-side behavior.

## Release checks and limits

The repository includes local tests for all exported configurations, query behavior and shared-link validation. Browser review covers responsive layouts, theme persistence, search, filters, JSON copy success and failure, and missing icons. Captures use the actual bundled catalog.

Android-side import and APK installation are not covered by the browser checks. App-source availability and each app's safety need separate review. No hosted deployment is supplied with this release. The container recipe is provided but is not part of the verified Windows release path.
