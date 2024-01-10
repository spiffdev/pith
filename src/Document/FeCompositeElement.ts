import { RenderingContext2D } from '../types'
import { FeElement } from './Element'

export class FeCompositeElement extends FeElement {
  override type = 'feComposite'

  apply(
    _: RenderingContext2D,
    _x: number,
    _y: number,
    _width: number,
    _height: number
  ) {
    // TODO: implement
  }
}
