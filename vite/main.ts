/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-env browser */
/* eslint-disable no-magic-numbers, import/unambiguous, no-console */

import {
  Pith,
  Document,
  Parser,
  presets
} from '../src'

let DEFAULT_WIDTH = 500
let DEFAULT_HEIGHT = 500
const search = new URLSearchParams(location.search)
const gallery = document.querySelector('#gallery') as any
const custom = document.querySelector('#custom') as any
const options = document.querySelector('#options') as any
const canvasOutput = document.querySelector('#canvas') as any
const svgOutput = document.querySelector('#svg') as any
let currentSvg = ''
let overrideTextBox = false

main()

function main() {
  if (search.has('no-ui')) {
    document.body.classList.add('no-ui')
    DEFAULT_WIDTH = 1280
    DEFAULT_HEIGHT = 720
  }

  if (search.has('redraw')) {
    options.redraw.checked = JSON.parse(search.get('redraw'))
  }

  if (search.has('render')) {
    options.render.value = search.get('render')
  }

  if (search.has('url')) {
    overrideTextBox = true
    render(search.get('url'), DEFAULT_WIDTH, DEFAULT_HEIGHT)
  }

  if (search.has('svg')) {
    overrideTextBox = true
    render(search.get('svg'), DEFAULT_WIDTH, DEFAULT_HEIGHT)
  }

  gallery.addEventListener('change', onGalleryChange)
  custom.addEventListener('submit', onCustomRenderSubmit)
  options.addEventListener('change', onOptionChange)
}

function onGalleryChange(event) {
  const { value } = event.target

  if (value) {
    overrideTextBox = true
    render(`../test/svgs/${value}`, DEFAULT_WIDTH, DEFAULT_HEIGHT)
  }
}

function onCustomRenderSubmit(event) {
  event.preventDefault()

  render(
    custom.svg.value,
    parseInt(custom.width.value, 10),
    parseInt(custom.height.value, 10)
  )
}

function onOptionChange() {
  if (currentSvg) {
    overrideTextBox = true
    render(currentSvg, DEFAULT_WIDTH, DEFAULT_HEIGHT)
  }
}

async function render(svg, width, height) {
  currentSvg = svg

  if (options.render.value === 'offscreen') {
    offscreenRender(svg, width, height)
    return
  }

  const c = Document.createCanvas(
    width || DEFAULT_WIDTH,
    height || DEFAULT_HEIGHT
  )
  const ctx = c.getContext('2d')
  const v = await Pith.from(ctx, svg)

  if (custom.resize.checked) {
    v.resize(width, height, custom.preserveAspectRatio.value)
    resizeSvg(v.document.documentElement)
  }

  canvasOutput.innerHTML = ''
  canvasOutput.appendChild(c)

  if (options.redraw.checked) {
    await v.start()
  } else {
    await v.render()
  }

  renderSource(svg)
}

async function offscreenRender(svg, width, height) {
  const c = new OffscreenCanvas(
    width || DEFAULT_WIDTH,
    height || DEFAULT_HEIGHT
  )
  const ctx = c.getContext('2d')
  const v = await Pith.from(ctx, svg, presets.offscreen())

  if (custom.resize.checked) {
    v.resize(width, height, custom.preserveAspectRatio.value)
    resizeSvg(v.document.documentElement)
  }

  await v.render()

  const blob = await c.convertToBlob()

  canvasOutput.innerHTML = `<img src="${URL.createObjectURL(blob)}">`

  renderSource(svg)
}

async function renderSource(svg) {
  if (search.has('no-svg')) {
    svgOutput.innerHTML = '<svg>'
    return
  }

  let svgText = svg

  if (!/^</.test(svg)) {
    const response = await fetch(svg)

    svgText = await response.text()
  }

  if (!/ xmlns="/.test(svgText)) {
    svgText = svgText.replace(/(<svg)/, '$1 xmlns="http://www.w3.org/2000/svg"')
  }

  const parser = new Parser()
  const document = parser.parseFromString(svgText)

  svgOutput.innerHTML = ''
  svgOutput.append(document.documentElement)

  if (overrideTextBox) {
    custom.svg.value = svgOutput.innerHTML
    overrideTextBox = false
  }
}

function resizeSvg(pithDocumentElement) {
  const svg = svgOutput.firstElementChild
  const attributes = [
    'width',
    'height',
    'viewBox',
    'preserveAspectRatio',
    'style'
  ]

  attributes.forEach((name) => {
    const attr = pithDocumentElement.getAttribute(name)

    if (attr.hasValue()) {
      svg.setAttribute(name, attr.getValue())
    }
  })
}
