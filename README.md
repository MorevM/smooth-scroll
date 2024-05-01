# @morev/smooth-scroll (still WIP)

![Stability of "master" branch](https://img.shields.io/github/workflow/status/MorevM/smooth-scroll/Build/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Last commit](https://img.shields.io/github/last-commit/morevm/smooth-scroll)
![Release version](https://img.shields.io/github/v/release/morevm/smooth-scroll?include_prereleases)
![GitHub Release Date](https://img.shields.io/github/release-date/morevm/smooth-scroll)
![Keywords](https://img.shields.io/github/package-json/keywords/morevm/smooth-scroll)

The last script for animated scrolling you ever need.

## Table of contents

* [Installation](#installation)
  * [Using `yarn`](#using-yarn)
  * [Using `npm`](#using-npm)
  * [Using `yarn`](#using-pnpm)
* [Usage](#usage)
  * [smooth-scroll](#smooth-scroll)
  * [smooth-scroll-native](#smooth-scroll-native)
* [Options](#options)
* [API](#api)
* [Recipes](#recipes)

## Installation

### Using `yarn`:

```bash
yarn add @morev/smooth-scroll
```

### Using `npm`:

```bash
npm install @morev/smooth-scroll
```

### Using `pnpm`

```bash
pnpm add @morev/smooth-scroll
```

## Usage

There are two modules you can use: `smooth-scroll` and `smooth-scroll-native`.

### smooth-scroll

Uses the `window.requestAnimationFrame`.

#### ES modules

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const scroll = new SmoothScroll({/* custom options */});
scroll.to('#target-element');
```

#### CommonJS

```js
const { SmoothScroll } = require('@morev/smooth-scroll');

const scroll = new SmoothScroll({/* custom options */});
scroll.to('#target-element');
```

### smooth-scroll-native

Uses the native `scrollTo` method with `behavior: smooth`.

#### ES modules

```js
import { SmoothScrollNative } from '@morev/smooth-scroll/native';

const scroll = new SmoothScrollNative({/* custom options */});
scroll.to('#target-element');
```

#### CommonJS

```js
const { SmoothScrollNative } = require('@morev/smooth-scroll/native');

const scroll = new SmoothScrollNative({/* custom options */});
scroll.to('#target-element');
```

### Vue.js

```js
import SmoothScroll from '@morev/smooth-scroll/vue';

Vue.use(SmoothScroll, {/* custom options */});
```

```vue
<template>
  <button @click="scrollTo"></button>
</template>

<script>
  export default {
    methods: {
      scrollTo() {
        this.$SmoothScroll.to('#target-element');
      },
    },
  };
</script>
```

> Vue module creates the only instance, so if you need multiple instances, you should use `SmoothScroll` directly.

## Options

### element

```ts
{
  element: HTMLElement | Window | 'auto;
}
```

The element being scrolled, `window` object, or `auto` for getting the nearest scrollable ancestor element.

Default value: `auto`.

> The value `auto` is suitable in most cases, but sometimes it may cause some unexpected behavior,
> mostly in scenarios involving fixed elements and/or not unique selectors. \
> It also does not affects if scroll target is a certain value rather than element. \
> So it is recommended to set this option explicitly, and maybe to have separated instances to process the page and inner blocks scrolling.

### duration

```ts
{
  duration: number | [number, number];
}
```

Scroll animation duration.

This is the number representing the amount of time in milliseconds that it should take to scroll 1000px.
The greater the distance, the longer the animation will take (twice as much for 2000px, three times more for 3000px, etc.).

There can also be supplied an array of two values which first value is duration and second value is duration limit. By default, the limit is 2000ms.

Does not affects while using `smooth-scroll-native`.

Default value: `[300, 700]`.

### easing

```ts
{
  easing: (time: number, begin: number, change: number, duration: number) => number;
}
```

The easing function used during the scroll animation.\
Can be one of [js-easing-functions](https://github.com/bameyrick/js-easing-functions#available-easing-functions) (included as dependency).\
See the example ["Custom animation"](#custom-animation).

Does not affects while using `smooth-scroll-native`.

Default value: imported `easeInOutQuad` function.

### ifNeeded

```ts
{
  ifNeeded: boolean;
}
```

Whether to not invoke scrolling if target position is already in viewport.

Default value: `false`.

### autofocus

```ts
{
  autofocus: boolean;
}
```

Whether to set focus to the target element after scrolling.\
Affects only if a given target is an element/selector.

Default value: `false`.

> It is strongly recommended to set this option to `true`, at least while navigating through the page.

### block

```ts
{
  block: 'start' | 'end' | 'center';
}
```

Alignment of the target element after scrolling by x-axis.\
Affects only if a given target is an element/selector.

Default value: `start`.

### inline

```ts
{
  inline: 'start' | 'end' | 'center';
}
```

Alignment of the target element after scrolling by y-axis.\
Affects only if a given target is an element/selector.

Default value: `start`.

### offset

```ts
{
  offset: number | { x: number; y: number; };
}
```

Additional offset(-s) added to the result position values. \
Single value treats as `Y`-axis offset, with object notation can set `X` and `Y` offsets both.
Affects only if a given target is an element/selector.

#### offset.x

Additional offset added to the result x-axis position value.

Default value: `0`.

#### offset.y

Additional offset added to the result y-axis position value.

Default value: `0`.

### fixedElements

```ts
{
  fixedElements: {
    x: {
      start: Array<HTMLElement | string>;
      end: Array<HTMLElement | string>;
    };
    y: {
      start: Array<HTMLElement | string>;
      end: Array<HTMLElement | string>;
    };
  };
}
```

A set of HTML elements (or its selectors) whose sizes should be considered in the result position calculation.\
Affects only if a given target is an element/selector.

#### fixedElements.x.start

An array of elements whose sizes should be excluded from the result x-axis position value.

Default value: `[]`.

#### fixedElements.x.end

An array of elements whose sizes should be included to the result x-axis position value.

Default value: `[]`.

#### fixedElements.y.start

An array of elements whose sizes should be excluded from the result y-axis position value.

Default value: `[]`.

#### fixedElements.y.end

An array of elements whose sizes should be included to the result y-axis position value.

Default value: `[]`.

## API

### to

Smoothly scrolls to a given target.

**Arguments:**

| Name    | Type                                     | Default | Description                                                                                         |
|---------|------------------------------------------|---------|-----------------------------------------------------------------------------------------------------|
| target* | `number\|number[]]\|HTMLElement\|string` | —       | A number (y-value), an array of two numbers (x and y values), HTML element or the element selector. |
| options | `object`                                 | `{}`    | Custom options, extends the initial options for current invocation.                                 |

**Returns:**

`Promise<number[]>` - Promise object representing the array of result x and y scroll position.

**Example:**

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const scroll = new SmoothScroll();

scroll.to(1000);
scroll.to([0, 1000]);
scroll.to(document.querySelector('#target-element'));
scroll.to('#target-element');
scroll.to('#target-element', {/* override the initial options */});
```

### addFixedElements

Dynamically adds fixed elements after initialization.

**Arguments:**

| Name       | Type                       | Default | Description                                                                             |
|------------|----------------------------|---------|-----------------------------------------------------------------------------------------|
| axis*      | `string`                   | —       | Whether to add the elements to the `x` or `y` category of `fixedElements` option.       |
| alignment* | `string`                   | —       | Whether to add the elements to the `start` or `end` category of `fixedElements` option. |
| elements*  | `...(HTMLElement\|string)` | —       | The elements being added.                                                               |

**Returns:**

`SmoothScroll` - The class instance.

**Example:**

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const scroll = new SmoothScroll();
scroll.addFixedElements('y', 'start', '.element-one', document.querySelector('.element-two'), '.element-three');
```

### removeFixedElements

Dynamically removes registered fixed elements.

**Arguments:**

| Name      | Type                       | Default | Description                 |
|-----------|----------------------------|---------|-----------------------------|
| elements* | `...(HTMLElement\|string)` | —       | The elements being removed. |

**Returns:**

`SmoothScroll` - The class instance.

**Example:**

```js
import { SmoothScroll } from 'smooth-scroll';

const scroll = new SmoothScroll({
  fixedElements: {
    y: {
      start: [
        document.querySelector('.element-one'),
        'element-two',
      ],
    },
  },
});

scroll.removeFixedElements('.element-one', document.querySelector('.element-two'));
```

> If one element is used in different categories of the `fixedElements` option, it will be removed everywhere.

## Recipes

### Sticky navigation with anchor links

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const scroll = new SmoothScroll({
  autofocus: true,
  fixedElements: {
    y: {
      start: ['#sticky-nav.is-fixed'],
    },
  },
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('#sticky-nav .anchor-link');
  if (!link) return;

  scroll.to(link.hash);
  e.preventDefault();
});
```

### Custom animation

```js
import { SmoothScroll } from '@morev/smooth-scroll';
import { easeInQuad } from '@morev/smooth-scroll/easing';

const scroll = new SmoothScroll({
  duration: 600,
  easing: easeInQuad,
});

scroll.to('#target-element');
```

### Fixed scroll animation duration

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const scroll = new SmoothScroll({
  duration: [600, 600], // animation will always take exactly the same amount of time
});

scroll.to('#target-element');
```

### Reduced motion mode

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const isMotionless = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scroll = new SmoothScroll({
  duration: isMotionless ? 0 : 400,
});

scroll.to('#target-element');
```

### Autofocus on the specific element

```js
import { SmoothScroll } from '@morev/smooth-scroll';

const scroll = new SmoothScroll();
const target = document.querySelector('#target-element');

scroll.to(target).then(() => {
  const needFocus = target.querySelector('.need-focus');
  needFocus.focus();
});
```
