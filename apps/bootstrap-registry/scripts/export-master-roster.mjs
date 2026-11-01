#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cardsDoc = JSON.parse(fs.readFileSync(path.join(root, 'registry/cards/master-roster-cards.json'), 'utf8'))
const deptsDoc = JSON.parse(fs.readFileSync(path.join(root, 'registry/cards/master-roster-departments.json'), 'utf8'))
const outDir = path.join(root, 'dist/cards')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'master-roster-cards.json'), JSON.stringify(cardsDoc, null, 2) + '\n')
fs.writeFileSync(path.join(outDir, 'master-roster-departments.json'), JSON.stringify(deptsDoc, null, 2) + '\n')
const csv = [
  'number,id,name,role,rarity,department,command',
  ...cardsDoc.cards.map((card) => [
    card.number,
    card.id,
    card.name,
    card.role,
    card.rarityRaw,
    card.departmentSlug,
    card.command,
  ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')),
].join('\n') + '\n'
fs.writeFileSync(path.join(outDir, 'master-roster-cards.csv'), csv)
console.log(`✓ Master roster exported: ${cardsDoc.cards.length} cards to dist/cards/`)
