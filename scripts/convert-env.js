#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

if (process.argv.length < 3) {
  console.error('Usage: node scripts/convert-env.js /path/to/old/.env')
  process.exit(1)
}

const inputPath = process.argv[2]
const outPath = path.resolve(__dirname, '..', '.env.local')

if (!fs.existsSync(inputPath)) {
  console.error('Input file not found:', inputPath)
  process.exit(2)
}

const content = fs.readFileSync(inputPath, 'utf8')
const lines = content.split(/\r?\n/)
const outLines = []

lines.forEach(line => {
  // keep comments and blank lines
  if (!line || line.trim().startsWith('#')) {
    outLines.push(line)
    return
  }

  const m = line.match(/^([^=]+)=(.*)$/)
  if (!m) {
    outLines.push(line)
    return
  }

  const key = m[1].trim()
  const val = m[2]


  // If already VITE_ keep as-is
  if (/^VITE_/i.test(key)) {
    outLines.push(`${key}=${val}`)
    return
  }

  // Otherwise keep original key (some tools may rely on it)
  outLines.push(`${key}=${val}`)
})

fs.writeFileSync(outPath, outLines.join('\n'))
console.log('Wrote', outPath)
