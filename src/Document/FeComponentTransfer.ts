import { RenderingContext2D } from "src/types";
import { Document } from './Document'
import { FeElement } from "./Element";

export class FeComponentTransfer extends FeElement {
  override type = 'feComponentTransfer';
  
  constructor(
    document: Document,
    node: HTMLElement,
    captureTextNodes?: boolean
  ) {
    super(document, node, captureTextNodes);
  }

  override apply(ctx: RenderingContext2D, x: number, y: number, width: number, height: number) {
      // TODO
  }
}
