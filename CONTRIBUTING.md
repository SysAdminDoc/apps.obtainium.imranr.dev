<div align="center">

[Deutsch](#beitragen)

</div>

# Contributing

This is SysAdminDoc's fork. Send changes for this copy to [this repository](https://github.com/SysAdminDoc/apps.obtainium.imranr.dev/pulls). To update the official hosted catalog, contribute to [upstream](https://github.com/ImranR98/apps.obtainium.imranr.dev) instead.

- To contribute content, create a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) with valid changes/additions to any files in the repo.
- Install Node.js 22.12 or newer and run `npm ci`, then `npm run dev` to test locally.
- Before submitting, run `npm run validate`, `npm test`, `npm run typecheck` and `npm run build`. Local data validation doesn't contact app sources or modify records.
- See https://github.com/ImranR98/Obtainium/issues/1214 for background/context for this repo.


## Contributing Apps

> [!IMPORTANT]
> Please make sure to read the [app criteria](APP_CRITERIA.md) before opening a PR with new/updated app configs.

- You can auto-generate config files from an Obtainium export by running `node scripts/generate_from_export.js <path to Obtainium export>`
- Note: Auto-generated entries will not have icon, category, or description data. Adding those manually is not required but would result in a better user experience.
- You can also auto-generate config files from an Obtainium URL redirection link by running `scripts/generate_from_url.py`
- Note: Using `scripts/generate_from_url.py` requires you to install "Colorama" by using the `pip` command `pip install colorama`


### Where to Put Your Config

Config files must be placed in the `public/data/apps/` directory:

- `public/data/apps/complex/<package-id>.json` is for apps with custom settings, a non-default source or multiple variants. These use a `configs` array.
- `public/data/apps/simple/<package-id>.json` is for apps that work with default settings, such as a plain GitHub source. These use a single `config` object.

Use a `.json` filename inside `public/data/apps/`. Files elsewhere, including a top-level `data/` directory, aren't loaded. Extensionless files aren't loaded either.


### Minimal Example

Each configuration needs `id`, `url`, `author` and `name`. Settings omitted from `additionalSettings` use Obtainium's defaults. Keep the source URL public and free of credentials. `additionalSettings` is a JSON-encoded string, so both layers must parse correctly.

For example:
- Minimal app JSON: `{"id":"dev.patrickgold.florisboard.beta","url":"https://github.com/florisboard/florisboard","author":"florisboard","name":"FlorisBoard Beta","additionalSettings":"{\"includePrereleases\":true}"}`
- As URL: https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/%7B%22id%22%3A%22dev.patrickgold.florisboard.beta%22%2C%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fflorisboard%2Fflorisboard%22%2C%22author%22%3A%22florisboard%22%2C%22name%22%3A%22FlorisBoard%20Beta%22%2C%22additionalSettings%22%3A%22%7B%5C%22includePrereleases%5C%22%3Atrue%7D%22%7D

---

# Beitragen

Dies ist der Fork von SysAdminDoc. Änderungen an dieser Kopie gehören in dieses Repository. Änderungen am offiziellen Katalog reichen Sie bitte bei [Upstream](https://github.com/ImranR98/apps.obtainium.imranr.dev) ein.

- Um Inhalte beizusteuern, erstellen Sie einen [Pull-Request](https://docs.github.com/de/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) mit gültigen Änderungen/Ergänzungen zu allen Dateien im Repo.
- Installieren Sie Node.js 22.12 oder neuer. Führen Sie `npm ci` und anschließend `npm run dev` aus.
- Prüfen Sie Änderungen mit `npm run validate`, `npm test`, `npm run typecheck` und `npm run build`. Die lokale Datenprüfung verändert keine Einträge und ruft keine App-Quellen auf.
- Siehe https://github.com/ImranR98/Obtainium/issues/1214 für den Hintergrund/Kontext für dieses Repo.


## Apps beisteuern

> [!IMPORTANT]
> Bitte stellen Sie sicher, dass Sie die [App-Kriterien](APP_CRITERIA.md) lesen, bevor Sie einen PR mit neuen/aktualisierten App-Konfigurationen eröffnen.

- Sie können Konfigurationsdateien automatisch aus einem Obtainium-Export generieren, indem Sie `node scripts/generate_from_export.js <Pfad zum Obtainium-Export>` ausführen.
- Hinweis: Automatisch generierte Einträge haben keine Symbol-, Kategorie- oder Beschreibungsdaten. Diese manuell hinzuzufügen ist nicht zwingend erforderlich, ist aber erwünscht, weil es zu einer besseren Benutzerfreundlichkeit führen würde.
- Sie können auch automatisch Konfigurationsdateien aus einem Obtainium-URL-Umleitungslink generieren, indem Sie `scripts/generate_from_url.py` ausführen.
- Hinweis: Die Verwendung von `scripts/generate_from_url.py` erfordert die Installation von „Colorama“ mit dem `pip` Befehl `pip install colorama`.


### Wohin mit der Konfiguration

Konfigurationsdateien müssen im Verzeichnis `public/data/apps/` abgelegt werden:

- `public/data/apps/complex/<package-id>.json` ist für Apps mit benutzerdefinierten Einstellungen, einer nicht standardmäßigen Quelle oder mehreren Varianten. Diese verwenden ein `configs`-Array.
- `public/data/apps/simple/<package-id>.json` ist für Apps, die mit Standardeinstellungen funktionieren, etwa einer einfachen GitHub-Quelle. Diese verwenden ein einzelnes `config`-Objekt.

Verwenden Sie die Endung `.json` innerhalb von `public/data/apps/`. Dateien an anderen Orten, etwa in einem `data`-Verzeichnis auf oberster Ebene, werden nicht geladen. Das gilt auch für Dateien ohne Endung.


### Minimalbeispiel

Um eine App-Konfiguration zu diesem Repo hinzuzufügen, muss Ihre App-Konfiguration JSON mindestens die Schlüssel `id`, `url`, `author`, und `name` enthalten. Beachten Sie, dass für jede app-spezifische Einstellung, die Sie nicht in `additionalSettings` definieren, der Standardwert verwendet wird.

Zum Beispiel:
- Minimale App JSON: `{"id":"dev.patrickgold.florisboard.beta","url":"https://github.com/florisboard/florisboard","author":"florisboard","name":"FlorisBoard Beta","additionalSettings":"{\"includePrereleases\":true}"}`
- Als URL: https://apps.obtainium.imranr.dev/redirect?r=obtainium://app/%7B%22id%22%3A%22dev.patrickgold.florisboard.beta%22%2C%22url%22%3A%22https%3A%2F%2Fgithub.com%2Fflorisboard%2Fflorisboard%22%2C%22author%22%3A%22florisboard%22%2C%22name%22%3A%22FlorisBoard%20Beta%22%2C%22additionalSettings%22%3A%22%7B%5C%22includePrereleases%5C%22%3Atrue%7D%22%7D
