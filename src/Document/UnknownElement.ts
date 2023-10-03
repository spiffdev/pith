import { Document } from './Document'
import { Element } from './Element'

export class UnknownElement extends Element {
  constructor(
    document: Document,
    node: HTMLElement,
    captureTextNodes?: boolean
  ) {
    super(document, node, captureTextNodes)
  }
}
