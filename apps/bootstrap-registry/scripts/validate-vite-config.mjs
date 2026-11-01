#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const app = path.join(root, 'apps', 'registry-console')
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'src/vite-env.d.ts',
  'src/data/master-roster.generated.ts',
  'src/components/MasterRosterGallery.tsx',
  'src/components/MasterRosterCard.tsx',
  'src/generated/index.json',
  'src/generated/analytics.json',
]
const errors = []
const read = (file) => fs.readFileSync(path.join(app, file), 'utf8')
for (const file of requiredFiles) if (!fs.existsSync(path.join(app, file))) errors.push(`missing ${file}`)
if (!errors.length) {
  const pkg = JSON.parse(read('package.json'))
  for (const dep of ['react', 'react-dom', 'zod']) if (!pkg.dependencies?.[dep]) errors.push(`apps/registry-console missing dependency: ${dep}`)
  if (!pkg.dependencies?.['@vitejs/plugin-react']) errors.push('apps/registry-console missing @vitejs/plugin-react')
  for (const script of ['dev', 'build', 'preview', 'typecheck']) if (!pkg.scripts?.[script]) errors.push(`apps/registry-console missing script: ${script}`)
  const tsconfig = JSON.parse(read('tsconfig.json'))
  if (tsconfig.compilerOptions?.isolatedModules !== true) errors.push('tsconfig must set isolatedModules: true')
  if (!tsconfig.compilerOptions?.types?.includes('vite/client')) errors.push('tsconfig compilerOptions.types must include vite/client')
  if (tsconfig.compilerOptions?.noEmit !== true) errors.push('tsconfig must set noEmit: true')
  const viteConfig = read('vite.config.ts')
  for (const token of ['react()', 'tsconfigPaths: true', 'cspNonce', 'license', 'chunkImportMap', 'assetsInlineLimit: 0']) if (!viteConfig.includes(token)) errors.push(`vite.config.ts missing ${token}`)
  const main = read('src/main.tsx')
  for (const token of ['createRoot', 'import.meta.hot', '<App />']) if (!main.includes(token)) errors.push(`src/main.tsx missing ${token}`)
  const roster = read('src/data/master-roster.generated.ts')
  if ((roster.match(/MR-\d{3}/g) ?? []).length !== 75) errors.push('master roster generated data must contain 75 cards')
}
if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`)
  process.exit(1)
}
console.log('✓ Vite React Master Roster configuration validated')
