/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Document } from './Document'

export class SVGFontLoader {
  loaded = false

  constructor(
    private readonly document: Document
  ) {
    document.fonts.push(this)
  }

  async load(fontFamily: string, url: string) {
    try {
      const { document } = this
      const svgDocument = await document.pith.parser.load(url)
      const fonts = svgDocument.getElementsByTagName('font')

      Array.from(fonts).forEach((fontNode) => {
        const font = document.createElement(fontNode as HTMLElement)

        document.definitions[fontFamily] = font
      })
    } catch (err) {
      console.error(`Error while loading font "${url}":`, err)
    }

    this.loaded = true
  }
}
