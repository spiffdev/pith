import { RenderingContext2D } from "src/types";
import { Document } from './Document'
import { Element, FeElement } from './Element'
import { imGet, imSet, toNumbers } from "../util";

abstract class FeFuncElement extends Element {
    readonly tableValues: number[]

    constructor(
        document: Document,
        node: HTMLElement,
        captureTextNodes?: boolean
    ) {
        super(document, node, captureTextNodes);
        this.tableValues = toNumbers(this.getAttribute('values').getString());
    }
}

export class FeFuncR extends FeFuncElement { override type = 'feFuncR' }
export class FeFuncG extends FeFuncElement { override type = 'feFuncG' }
export class FeFuncB extends FeFuncElement { override type = 'feFuncB' }

export class FeComponentTransfer extends FeElement {
    override type = 'feComponentTransfer';

    constructor(
        document: Document,
        node: HTMLElement,
        captureTextNodes?: boolean
    ) {
        super(document, node, captureTextNodes);
    }

    // New pixel value in accordance with the logic in the spec.
    // https://www.w3.org/TR/SVG11/filters.html#feComponentTransferElement
    // At the time of writing, assume the func elements are always the discrete type.
    private calculateDiscrete(old: number, feFunc: FeFuncElement): number {
        if (old === 1) {
            return feFunc.tableValues[feFunc.tableValues.length];
        }
        return old;
    }

    override apply(ctx: RenderingContext2D, _x: number, _y: number, width: number, height: number) {
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
                const nr = this.calculateDiscrete(r, rFunc);
                const ng = this.calculateDiscrete(g, gFunc);
                const nb = this.calculateDiscrete(b, bFunc);
                imSet(srcData.data, x, y, width, height, 0, nr);
                imSet(srcData.data, x, y, width, height, 1, ng);
                imSet(srcData.data, x, y, width, height, 2, nb);
            }
        }

        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(srcData, 0, 0);
    }
}
