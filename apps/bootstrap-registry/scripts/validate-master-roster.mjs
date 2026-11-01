#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cardsPath = path.join(root, 'registry/cards/master-roster-cards.json')
const deptsPath = path.join(root, 'registry/cards/master-roster-departments.json')
const cardsDoc = JSON.parse(fs.readFileSync(cardsPath, 'utf8'))
const deptsDoc = JSON.parse(fs.readFileSync(deptsPath, 'utf8'))
const cards = cardsDoc.cards ?? []
const depts = deptsDoc.departments ?? []
const errors = []
const ids = new Set()
const numbers = new Set()
const allowedRarities = new Set(['rare', 'epic', 'legendary', 'mythic', 'genesis-founder'])

if (cards.length !== 75) errors.push(`expected 75 cards, got ${cards.length}`)
if (depts.length !== 5) errors.push(`expected 5 departments, got ${depts.length}`)

for (const card of cards) {
  if (!/^MR-\d{3}$/.test(card.id)) errors.push(`${card.name} invalid id ${card.id}`)
  if (ids.has(card.id)) errors.push(`duplicate card id ${card.id}`)
  ids.add(card.id)
  if (numbers.has(card.number)) errors.push(`duplicate card number ${card.number}`)
  numbers.add(card.number)
  if (!allowedRarities.has(card.rarity)) errors.push(`${card.id} invalid rarity ${card.rarity}`)
  if (!card.command?.startsWith('mise roster run ')) errors.push(`${card.id} invalid command`)
  if (!depts.some((dept) => dept.id === card.departmentId && dept.slug === card.departmentSlug)) errors.push(`${card.id} invalid department binding`)
}

for (const dept of depts) {
  const count = cards.filter((card) => card.departmentId === dept.id).length
  if (count !== 15) errors.push(`${dept.name} expected 15 cards, got ${count}`)
  if (dept.count !== count) errors.push(`${dept.name} declared count ${dept.count}, actual ${count}`)
}

for (let n = 1; n <= 75; n += 1) if (!numbers.has(n)) errors.push(`missing card number ${n}`)

if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`)
  process.exit(1)
}
console.log(`✓ Master roster validated: ${cards.length} cards across ${depts.length} departments`)
