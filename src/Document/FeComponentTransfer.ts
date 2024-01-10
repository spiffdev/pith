import { RenderingContext2D } from "src/types";
import { Document } from './Document'
import { Element, FeElement } from './Element'
import { imGet, imSet } from "../util";

export class FeFuncR extends Element { }
export class FeFuncG extends Element { }
export class FeFuncB extends Element { }

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
        let rFunc: FeFuncR | undefined = undefined;
        let gFunc: FeFuncG | undefined = undefined;
        let bFunc: FeFuncB | undefined = undefined;

        // Select last child of each type, in accordance with MDN docs.
        children.forEach((child: Element) => {
            if (child instanceof FeFuncR) {
                rFunc = child;
            } else if (child instanceof FeFuncG) {
                gFunc = child;
            } else if (child instanceof FeFuncB) {
                bFunc = child;
            }
        });

        const srcData = ctx.getImageData(0, 0, width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const r = imGet(srcData.data, x, y, width, height, 0);
                const g = imGet(srcData.data, x, y, width, height, 1);
                const b = imGet(srcData.data, x, y, width, height, 2);
                const nr = r;
                const ng = g;
                const nb = b;
                imSet(srcData.data, x, y, width, height, 0, nr);
                imSet(srcData.data, x, y, width, height, 1, ng);
                imSet(srcData.data, x, y, width, height, 2, nb);
            }
        }

        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(srcData, 0, 0);
    }
}
