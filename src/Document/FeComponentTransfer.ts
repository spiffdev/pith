import { RenderingContext2D } from "src/types";
import { Document } from './Document'
import { Element, FeElement } from './Element'

export class FeFuncR extends Element {}
export class FeFuncG extends Element {}
export class FeFuncB extends Element {}

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
    const { children } = this;
    let r: FeFuncR | undefined = undefined;
    let g: FeFuncG | undefined = undefined;
    let b: FeFuncB | undefined = undefined;

    // Select last child of each type, in accordance with MDN docs.
    children.forEach((child: Element) => {
        if (child instanceof FeFuncR) {
            r = child;
        } else if (child instanceof FeFuncG) {
            g = child;
        } else if (child instanceof FeFuncB) {
            b = child;
        }
    });
  }
}
