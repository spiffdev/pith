# pith

JavaScript SVG parser and renderer on Canvas. It takes the URL to the SVG file or the text of the SVG file, parses it in JavaScript and renders the result on Canvas. It also can be used to rasterize SVG images.

## Quickstart

Install this library using your favorite package manager:

```sh
pnpm add pith "https://github.com/spiffdev/pith.git"
# or
yarn add pith "https://github.com/spiffdev/pith.git"
# or
npm i pith "https://github.com/spiffdev/pith.git"
```

Then, just import `Pith` and use it:

```js
import { Pith } from 'pith';

let v = null;

window.onload = async () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  v = await Pith.from(ctx, './svgs/1.svg');

  // Start SVG rendering with animations and mouse handling.
  v.start();
};

window.onbeforeunload = () => {
  v.stop();
};
```
