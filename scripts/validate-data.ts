import { getApps, getCategories } from '../src/lib/data'
import { getAppConfig, getAppConfigString } from '../src/lib/query'
import { validateConfig } from '../src/lib/config'

const apps = getApps()
if (!apps.length) throw new Error('The catalog is empty')
let configurations = 0
for (const app of apps) {
  for (let i = 0; i < getAppConfig(app).length; i++) {
    validateConfig(JSON.parse(getAppConfigString(app, 'en', i)))
    configurations++
  }
  if (app.categories.some(category => !Object.hasOwn(getCategories(), category))) throw new Error('Unknown category')
}
console.log(JSON.stringify({ listings: apps.length, configurations, categories: new Set(apps.flatMap(app => app.categories)).size, mode: 'read-only, no network' }))
