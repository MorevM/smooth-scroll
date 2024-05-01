import type { PartialDeep } from '@morev/utils';

export type Axis = 'x' | 'y';
export type Alignment = 'start' | 'center' | 'end';
export type ScrollValue = [number, number];
export type ScrollTarget = number | ScrollValue | HTMLElement | string;
export type ScrollElement = HTMLElement | Window;

export type Options = {
	/**
	 * The element being scrolled, `window` object, or `auto` for getting the nearest scrollable ancestor element. \
	 * Value `auto` affects only if a given target is an element/selector.
	 *
	 * @default 'auto'
	 */
	element: ScrollElement | 'auto';

	/**
	 * Scroll animation duration or an array of duration value and maximum value.
	 *
	 * @default [300, 700]
	 */
	duration: number | [number, number] | readonly [number, number];

	/**
	 * TODO:
	 * The easing function used during the scroll animation, `easeInOutQuad` by default.
	 *
	 * @see https://github.com/bameyrick/js-easing-functions#available-easing-functions.
	 *
	 * @param   time       [time description]
	 * @param   begin      [begin description]
	 * @param   change     [change description]
	 * @param   duration   [duration description]
	 *
	 * @returns            [return description]
	 */
	easing: (time: number, begin: number, change: number, duration: number) => number;

	/**
	 * Whether to not invoke scrolling if the target position is already in the viewport. \
	 * Affects only if a given target is an element/selector.
	 *
	 * @default false
	 */
	ifNeeded: boolean;

	/**
	 * Whether to set focus to the target element after scrolling. \
	 * Affects only if a given target is an element/selector.
	 *
	 * @default false
	 */
	autofocus: boolean;

	/**
	 * Alignment of the target element after scrolling by x-axis: `start` | `center` | `end`. \
	 * Affects only if a given target is an element/selector.
	 *
	 * @default 'start'
	 */
	block: Alignment;

	/**
	 * Alignment of the target element after scrolling by y-axis: `start` | `center` | `end`. \
	 * Affects only if a given target is an element/selector.
	 *
	 * @default 'start'
	 */
	inline: Alignment;

	/**
	 * Additional offset(-s) added to the result position values. \
	 * Single value treats as `y` offset, with object notation you can set `x` and `y` offsets both. \
	 * Affects only if a given target is an element/selector.
	 *
	 * @default { x: 0, y: 0 }
	 */
	offset: number | {
		/**
		 * Additional offset added to the result x-axis position value.
		 *
		 * @default 0
		 */
		x: number;

		/**
		 * Additional offset added to the result y-axis position value.
		 *
		 * @default 0
		 */
		y: number;
	};

	/**
	 * Collection of HTML elements (or its selectors) whose sizes should be considered in the result position calculation. \
	 * Affects only if a given target is an element/selector.
	 *
	 * Useful in case you have an attached header, footer with dynamic width/height.
	 *
	 * @default { x: { start: [], end: [] }, y: { start: [], end: [] }, }
	 */
	fixedElements: {
		/**
		 * Collection of elements whose sizes should be considered in the result x-axis position calculation.
		 *
		 * @default { start: [], end: [] }
		 */
		x: {
			/**
			 * An array of elements (or its selectors) whose sizes should be excluded from the result x-axis position value.
			 *
			 * @default []
			 */
			start: Array<HTMLElement | string>;

			/**
			 * An array of elements (or its selectors) whose sizes should be included from the result x-axis position value.
			 *
			 * @default []
			 */
			end: Array<HTMLElement | string>;
		};

		/**
		 * Collection of elements whose sizes should be considered in the result y-axis position calculation.
		 *
		 * @default { start: [], end: [] }
		 */
		y: {
			/**
			 * An array of elements (or its selectors) whose sizes should be excluded from the result y-axis position value.
			 *
			 * @default []
			 */
			start: Array<HTMLElement | string>;

			/**
			 * An array of elements (or its selectors) whose sizes should be included from the result y-axis position value.
			 *
			 * @default []
			 */
			end: Array<HTMLElement | string>;
		};
	};
};

export type PartialOptions = Omit<Partial<Options>, 'offset' | 'fixedElements'>
	& { offset?: Partial<Options['offset']> }
	& { fixedElements?: PartialDeep<Options['fixedElements']> };

export type _NormalizedOptions = Omit<Options, 'offset'> & {
	offset: { x: number; y: number };
};

export type _FixedElements = {
	x: {
		start: Array<string | HTMLElement>;
		end: Array<string | HTMLElement>;
	};
	y: {
		start: Array<string | HTMLElement>;
		end: Array<string | HTMLElement>;
	};
};

export type _FixedElementOffsets = {
	x: {
		start: number;
		end: number;
	};
	y: {
		start: number;
		end: number;
	};
};
