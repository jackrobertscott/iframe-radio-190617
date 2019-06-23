# iframe-radio

> 📻 Communicate between an iframe and a web page.

## Installation

Using npm:

```shell
npm i --save iframe-radio
```

Using yarn:

```shell
yarn add iframe-radio
```

Then import the radio in your app:

```ts
import { Radio } from 'iframe-radio';
```

This package was created by the makers of [Window Gadgets](https://windowgadgets.io).

## Usage

The radio may listen to any window object. As such, we will need to create a instance of the radio inside the *iframe* and in the *window* which encapsulates the iframe.

### Setup

Inside your app; create a radio instance to listen to the iframe.

```ts
import { Radio } from 'iframe-radio';

const iframeRadio = new Radio({
  id: 'window-gadgets-1234567890',
  node: document.getElementsByTagName("iframe")[0].contentWindow,
});
```

Inside your iframe; create another radio instance to listen to the parent window.

```ts
import { Radio } from 'iframe-radio';

const parentRadio = new Radio({
  id: 'window-gadgets-1234567890',
  node: window.parent,
});
```

**Params**

- `id: string`
- `node?: Window`

### Send Messages

You may send any type of data through the radio.

```ts
import { iframeRadio } from './my-utils';

iframeRadio.message({ name: 'Jack' });
```

### Recieve Messages

You may now listen to all messages which are sent through the radio.

```ts
import { parentRadio } from './my-utils';

parentRadio.listen(({ name }) => {
  console.log(`My name is ${name}.`);
});
```

## Credits

Made with ❤️ by the makers of [Window Gadgets](https://windowgadgets.io).
