# Obtainium Apps v0.0.2 verification

## Local checks

The catalog contains 254 listings, 378 configurations and 55 categories. All 32 local tests pass. They cover every exported configuration, unsafe source URLs, malformed shared links, query parsing, filtering, pagination and language handling. The icon validator's failure path is tested against an isolated local endpoint and leaves the input file unchanged. An optional statistics fixture verifies link-click totals and caching without contacting an external service.

The extracted source package installs with `npm ci`, passes all 32 tests and builds successfully. Type checking reports zero errors, warnings or hints. The dependency review reports zero advisories. These checks used Node.js 24 on Windows.

## Browser evidence

The passing app-r6 review contains 42 checks against the running Node server. It exercises homepage search, JSON copy success and failure, theme persistence, category selection, language-preserving navigation, the API and shared-link handling. Missing images and JavaScript-disabled rendering are included. No unhandled browser exceptions or unexpected external script/font requests occurred.

Every browser was headless with a dedicated profile. No signed-in profile, user clipboard, active desktop, external Android intent or real phone was used. The catalog's third-party icons were allowed to load for the normal captures.

The identity review retains the original 72 × 72 RGBA icon. Its four corner alpha values are zero and its bytes match the preserved original. Selected screenshot copies are byte-identical to their capture files. Both share-card layouts and the README were reviewed on dark/light surfaces and a narrow viewport. Earlier iterations remain in the archive.

## Package checks

The source ZIP was extracted into a fresh directory. Every file matched the staged Git source. The preserved original ZIP was extracted separately: all 299 original Git files matched their original blob hashes. All 252 previously visible app records retain their exact original Git bytes. A secret scan of the source and nested archive found no leaks.

The prebuilt server ZIP was extracted separately, and every packaged file matched the build directory. A fresh `npm ci --omit=dev` installation passed the same 42 browser checks against its running server. Its 12 actual captures are retained in [package-r1](package-r1). Desktop and mobile captures were also checked visually against the selected product images.

The final packaging step adds these verification notes and package captures without changing the tested application files. Source and server downloads include this concept archive. SHA-256 checksums accompany the release assets.

## Explicit limits

These checks do not verify Android-side configuration import, APK installation or the safety of listed apps. Hosted HTTPS deployment, the container recipe and GitHub's separate Settings social-image upload were not exercised. The official hosted catalog was not changed.
