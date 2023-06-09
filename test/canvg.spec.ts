import path from 'path'
import { promises as fs } from 'fs'
import { DOMParser } from 'xmldom'
import * as canvas from 'canvas'
import fetch from 'node-fetch'
import { Pith, presets } from '../src'

const preset = presets.node({
  DOMParser,
  canvas,
  fetch
})

describe('Pith', () => {
  describe('render', () => {
    it('should render twice without deadlock', async () => {
      const svg = await fs.readFile(path.join(__dirname, 'svgs/favicon.svg'), 'utf8')
      const c = preset.createCanvas(1280, 720) as canvas.Canvas
      const ctx = c.getContext('2d')
      const pith = Pith.fromString(ctx, svg, preset)

      await pith.render()
      await pith.render()
    }, 200)
  })
})
