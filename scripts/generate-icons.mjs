import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'

const sizes = [192, 512]

for (const size of sizes) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Black background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, size, size)

  // Yellow centered text
  const fontSize = Math.round(size * 0.3)
  ctx.fillStyle = '#f5a623'
  ctx.font = `bold ${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HRC', size / 2, size / 2)

  mkdirSync('public/icons', { recursive: true })
  writeFileSync(`public/icons/icon-${size}.png`, canvas.toBuffer('image/png'))
  console.log(`Generated icon-${size}.png`)
}
