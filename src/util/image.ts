export function imGet(
  img: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  _height: number,
  rgba: number
) {
  return img[y * width * 4 + x * 4 + rgba]
}

export function imSet(
  img: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  _height: number,
  rgba: number,
  val: number
) {
  img[y * width * 4 + x * 4 + rgba] = val
}
