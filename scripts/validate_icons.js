import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
const DATA_DIR = path.join(process.cwd(), 'public/data')
const APPS_DIR = path.join(DATA_DIR, 'apps')

const dryRun = !process.argv.includes('--write') || process.argv.includes('--dry-run')
let failures = 0

function getAllJsonFiles(dir) {
  const results = []
  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      results.push(...getAllJsonFiles(fullPath))
    } else if (item.endsWith('.json')) {
      results.push(fullPath)
    }
  }
  return results
}

async function validateIcon(url) {
  if (!url) return true
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/*' }
    })
    clearTimeout(timeout)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const buffer = await response.arrayBuffer()
    const image = sharp(Buffer.from(buffer))
    await image.metadata()
    return true
  } catch (err) {
    console.warn(`Bad icon URL: ${url}`, err.message)
    return false
  }
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  let data
  try {
    data = JSON.parse(content)
  } catch (err) {
    console.error(`Invalid JSON in ${filePath}:`, err.message)
    failures++
    return
  }

  if (data.icon) {
    const isValid = await validateIcon(data.icon)
    if (!isValid) {
      failures++
      if (dryRun) {
        console.log(`[DRY RUN] Would update ${filePath}: icon set to null`)
      } else {
        data.icon = null
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
        console.log(`Updated ${filePath}: icon set to null`)
      }
    }
  }
}

async function main() {
  const files = getAllJsonFiles(APPS_DIR)
  console.log(`Found ${files.length} JSON files`)

  let nextFile = 0
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (nextFile < files.length) await processFile(files[nextFile++])
  }))
  console.log('Validation complete')
  if (dryRun) {
    console.log('Read-only check complete. No files were modified.')
  }
  if (failures) process.exitCode = 1
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
