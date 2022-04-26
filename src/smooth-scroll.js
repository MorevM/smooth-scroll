import {
	clamp,
	getElement,
	getElementOffset,
	getScrollLimit,
	isArray,
	isElement,
	isNullish,
	isNumeric,
	getScrollableAncestor,
} from '@morev/helpers';
import { disablePageScroll, enablePageScroll } from './utils/scroll-utils.js';
import { defaults, normalizeOptions } from './utils/options-utils.js';
import { easeInOutQuad } from './easing.js';

class SmoothScroll {
	/**
	 * Default options.
	 *
	 * @protected
	 */
	_defaultOptions = {
		element: 'auto',
		duration: [300, 700],
		easing: easeInOutQuad,
		ifNeeded: false,
		autofocus: false,
		block: 'start',
		inline: 'start',
		offset: { x: 0, y: 0 },
		fixedElements: {
			x: { start: [], end: [] },
			y: { start: [], end: [] },
		},
	};

	/**
	 * Initial options.
	 * Set while create new instance.
	 *
	 * @protected
	 */
	_initialOptions = {};

	/**
	 * Working options.
	 * Set during actions invoking.
	 *
	 * @protected
	 */
	_options = {};

	/**
	 * The element being scrolled.
	 *
	 * @protected
	 */
	_scrollElement;

	/**
	 * Default element being scrolled.
	 *
	 * @protected
	 */
	_defaultScrollElement = window;

	/**
	 * Scroll animation duration limit.
	 *
	 * @protected
	 */
	_durationMax = 2000;

	/**
	 * RequestAnimationFrame storage.
	 *
	 * @protected
	 */
	_scrolling = null;

	/**
	 * Initializes class instance.
	 *
	 * @param   {object}                      [options]                         Custom options, extends the defaults.
	 * @param   {HTMLElement|string|Window}   [options.element]                 The element being scrolled, the `window` object, or `auto` for getting the nearest scrollable ancestor element.
	 *                                                                          Value `auto` affects only if a given target is an element/selector.
	 * @param   {number|number[]}             [options.duration]                Scroll animation duration or an array of duration value and maximum value.
	 * @param   {Function}                    [options.easing]                  The easing function used during the scroll animation, `easeInOutQuad` by default.
	 *                                                                          See https://github.com/bameyrick/js-easing-functions#available-easing-functions.
	 * @param   {boolean}                     [options.ifNeeded]                Whether to not invoke scrolling if target position is already in viewport.
	 *                                                                          Affects only if a given target is an element/selector.
	 * @param   {boolean}                     [options.autofocus]               Whether to set focus to the target block after scrolling.
	 *                                                                          Affects only if a given target is an element/selector.
	 * @param   {string}                      [options.block]                   Alignment of the target element after scrolling by x-axis: start|center|end.
	 *                                                                          Affects only if a given target is an element/selector.
	 * @param   {string}                      [options.inline]                  Alignment of the target element after scrolling by y-axis: start|center|end.
	 *                                                                          Affects only if a given target is an element/selector.
	 * @param   {number|object}               [options.offset]                  Additional offset(-s) added to the result position values. Single value treats as `y` offset, with object notation can set `x` and `y` offsets both.
	 *                                                                          Affects only if a given target is an element/selector.
	 * @param   {number}                      [options.offset.x]                Additional offset added to the result x-axis position value.
	 * @param   {number}                      [options.offset.y]                Additional offset added to the result y-axis position value.
	 * @param   {object}                      [options.fixedElements]           Collection of HTML elements (or its selectors) whose sizes should be considered in the result position calculation.
	 *                                                                          Affects only if a given target is an element/selector.
	 * @param   {object}                      [options.fixedElements.x]         Collection of elements whose sizes should be considered in the result x-axis position calculation.
	 * @param   {Array<HTMLElement|string>}   [options.fixedElements.x.start]   An array of elements whose sizes should be excluded from the result x-axis position value.
	 * @param   {Array<HTMLElement|string>}   [options.fixedElements.x.end]     An array of elements whose sizes should be included to the result x-axis position value.
	 * @param   {object}                      [options.fixedElements.y]         Collection of elements whose sizes should be considered in the result y-axis position calculation.
	 * @param   {Array<HTMLElement|string>}   [options.fixedElements.y.start]   An array of elements whose sizes should be excluded from the result y-axis position value.
	 * @param   {Array<HTMLElement|string>}   [options.fixedElements.y.end]     An array of elements whose sizes should be included to the result y-axis position value.
	 */
	constructor(options = {}) {
		this._initialOptions = defaults(this._defaultOptions, normalizeOptions(options));
	}

	/**
	 * Retrieves the adjusted scroll animation duration.
	 *
	 * @param     {number}                      move               The needed scroll distance.
	 * @param     {number|number[]|undefined}   [customDuration]   Custom scroll animation duration parameters, overrides the same option.
	 *
	 * @returns   {number}                                         The time in milliseconds that it should take to scroll a given distance.
	 *
	 * @protected
	 */
	_getDuration(move, customDuration = undefined) {
		const [duration, max = this._durationMax] = [customDuration ?? this._options.duration].flat();
		const k = Math.max(1, Math.abs(Math.round(move / 1000)));

		return clamp(duration * k, 1, max);
	}

	/**
	 * Calculates the registered fixed elements sizes.
	 *
	 * @returns   {object}   An object structured as `fixedElements` option, containing sum of fixed elements sizes.
	 *
	 * @protected
	 */
	_calcFixedElements() {
		return Object.entries(this._options.fixedElements).reduce((acc, [_axis, _opts]) => {
			acc[_axis] = Object.entries(_opts).reduce((acc2, [_align, _stack]) => {
				acc2[_align] = _stack
					.map((el) => getElement(el, this._scrollElement))
					.filter((n, i, arr) => Boolean(n) && arr.indexOf(n) === i)
					.reduce((sum, el) => {
						sum += _axis === 'x' ? el.offsetWidth : el.offsetHeight;
						return sum;
					}, 0);
				return acc2;
			}, {});
			return acc;
		}, {});
	}

	/**
	 * Retrieves the current scroll position of scrollable element.
	 *
	 * @returns   {number[]}   An array of current x and y scroll position.
	 *
	 * @protected
	 */
	_getCurrentScroll() {
		const scrollX = isElement(this._scrollElement)
			? this._scrollElement.scrollLeft
			: window.scrollX ?? window.pageXOffset;

		const scrollY = isElement(this._scrollElement)
			? this._scrollElement.scrollTop
			: window.scrollY ?? window.pageYOffset;

		return [scrollX, scrollY];
	}

	/**
	 * Retrieves the ranges of scroll values that are in the viewport now.
	 *
	 * @returns   {object}   An object of scroll values ranges (x and y).
	 *
	 * @protected
	 */
	_getViewportRange() {
		let [startX, startY] = this._getCurrentScroll();

		let endX = startX + (isElement(this._scrollElement) ? this._scrollElement.offsetWidth : window.innerWidth);
		let endY = startY + (isElement(this._scrollElement) ? this._scrollElement.offsetHeight : window.innerHeight);

		const fixedValues = this._calcFixedElements();

		startX += fixedValues.x.start;
		startY += fixedValues.y.start;

		endX -= fixedValues.x.end;
		endY -= fixedValues.y.end;

		return {
			x: [startX, endX],
			y: [startY, endY],
		};
	}

	/**
	 * Adjusts current scroll position by increasing/decreasing it on 1px.
	 * To be sure that nearest sticky elements wil be considered on the needed scroll position values calculation.
	 *
	 * @param     {number[]}   value   An array of target x and y scroll position.
	 *
	 * @returns   {void}
	 *
	 * @protected
	 */
	_adjustPosition(value) {
		const [startX, startY] = this._getCurrentScroll();
		const [endX, endY] = value;

		const [changeX, changeY] = [endX - startX, endY - startY];
		const [deltaX, deltaY] = [changeX, changeY].map(v => Math.abs(v));

		const adjustX = startX + (deltaX > 1 ? changeX / deltaX : 0);
		const adjustY = startY + (deltaY > 1 ? changeY / deltaY : 0);

		this._scrollElement.scrollTo(adjustX, adjustY);
	}

	/**
	 * Sets focus on a given element.
	 *
	 * @param   {?HTMLElement}   element   The element to be focused.
	 *
	 * @protected
	 */
	_setFocus(element) {
		if (!element) return;

		const scrollX = window.scrollX ?? window.pageXOffset;
		const scrollY = window.scrollY ?? window.pageYOffset;

		element.tabIndex = -1;
		element.focus({ preventScroll: true });

		window.scrollTo(scrollX, scrollY); // `preventScroll` not working in IE<17 and Safari
	}

	/**
	 * Cancels current scrolling animation.
	 *
	 * @returns   {void}
	 *
	 * @protected
	 */
	_cancelScrolling() {
		if (this._scrolling !== null) {
			window.cancelAnimationFrame(this._scrolling);
		}

		this._scrolling = null;
	}

	/**
	 * Adjusts a given scroll position considering the alignment options.
	 *
	 * @param     {number[]}      value     Scroll position x and y values.
	 * @param     {HTMLElement}   element   The scroll target element.
	 *
	 * @returns   {number[]}                Adjusted scroll position values.
	 *
	 * @protected
	 */
	_adjustScrollAlignment = (value, element) => {
		let [valueX, valueY] = value;

		const elementWidth = element.offsetWidth;
		const elementHeight = element.offsetHeight;

		const scrollableWidth = isElement(this._scrollElement) ? this._scrollElement.clientWidth : window.innerWidth;
		const scrollableHeight = isElement(this._scrollElement) ? this._scrollElement.clientHeight : window.innerHeight;

		switch (this._options.inline) {
			case 'end':
				valueX += elementWidth;
				valueX -= scrollableWidth;
				break;

			case 'center':
				valueX += elementWidth / 2;
				valueX -= scrollableWidth / 2;
				break;
		}

		switch (this._options.block) {
			case 'end':
				valueY += elementHeight;
				valueY -= scrollableHeight;
				break;

			case 'center':
				valueY += elementHeight / 2;
				valueY -= scrollableHeight / 2;
				break;
		}

		return [valueX, valueY];
	};

	/**
	 * Adjusts a given scroll position considering the `scroll-margin-*` properties.
	 *
	 * @param     {number[]}      value     Scroll position x and y values.
	 * @param     {HTMLElement}   element   The scroll target element.
	 *
	 * @returns   {number[]}                Adjusted scroll position values.
	 *
	 * @protected
	 */
	_adjustScrollMargin = (value, element) => {
		let [valueX, valueY] = value;

		const styles = window.getComputedStyle(element);
		const marginTop = parseInt(styles.getPropertyValue('scroll-margin-top') || 0, 10);
		const marginRight = parseInt(styles.getPropertyValue('scroll-margin-right') || 0, 10);
		const marginBottom = parseInt(styles.getPropertyValue('scroll-margin-bottom') || 0, 10);
		const marginLeft = parseInt(styles.getPropertyValue('scroll-margin-left') || 0, 10);

		switch (this._options.inline) {
			case 'start':
				valueX -= marginLeft;
				break;

			case 'end':
				valueX += marginRight;
				break;

			case 'center':
				valueX -= marginLeft / 2;
				valueX += marginRight / 2;
				break;
		}

		switch (this._options.block) {
			case 'start':
				valueY -= marginTop;
				break;

			case 'end':
				valueY += marginBottom;
				break;

			case 'center':
				valueY -= marginTop / 2;
				valueY += marginBottom / 2;
				break;
		}

		return [valueX, valueY];
	};

	/**
	 * Adjusts a given scroll position considering the `fixedElements` option.
	 *
	 * @param     {number[]}      value     Scroll position x and y values.
	 * @param     {HTMLElement}   element   The scroll target element.
	 *
	 * @returns   {number[]}                Adjusted scroll position values.
	 *
	 * @protected
	 */
	_adjustScrollFixedElements = (value, element) => {
		let [valueX, valueY] = value;
		const fixedValues = this._calcFixedElements();

		switch (this._options.inline) {
			case 'start':
				valueX -= fixedValues.x.start;
				break;

			case 'end':
				valueX += fixedValues.x.end;
				break;

			case 'center':
				valueX -= fixedValues.x.start / 2;
				valueX += fixedValues.x.end / 2;
				break;
		}

		switch (this._options.block) {
			case 'start':
				valueY -= fixedValues.y.start;
				break;

			case 'end':
				valueY += fixedValues.y.end;
				break;

			case 'center':
				valueY -= fixedValues.y.start / 2;
				valueY += fixedValues.y.end / 2;
				break;
		}

		return [valueX, valueY];
	};

	/**
	 * Adjusts a given scroll position considering the `offset` option.
	 *
	 * @param     {number}        value     Scroll position x and y values.
	 * @param     {HTMLElement}   element   The scroll target element.
	 *
	 * @returns   {number}                  Adjusted scroll position values.
	 *
	 * @protected
	 */
	_adjustScrollOffset = (value, element) => {
		let [valueX, valueY] = value;

		valueX += this._options.offset.x;
		valueY += this._options.offset.y;

		return [valueX, valueY];
	};

	/**
	 * Retrieves the needed scroll position value (for both x and y axis) based on a given target element.
	 *
	 * @param     {HTMLElement}   element   Scroll target HTML element.
	 *
	 * @returns   {number[]}                Scroll position x and y values.
	 *
	 * @protected
	 */
	_getElementScrollValue(element) {
		let { left: valueX, top: valueY } = getElementOffset(element, 'both', this._scrollElement);

		[valueX, valueY] = this._adjustScrollAlignment([valueX, valueY], element);
		[valueX, valueY] = this._adjustScrollMargin([valueX, valueY], element);
		[valueX, valueY] = this._adjustScrollFixedElements([valueX, valueY], element);
		[valueX, valueY] = this._adjustScrollOffset([valueX, valueY], element);

		return [valueX, valueY];
	}

	/**
	 * Retrieves the needed scroll position value (for both x and y axis) based on a given target.
	 *
	 * @param     {number|number[]|HTMLElement|string}   target   Scroll target: y-value, an array of x and y values, HTML element or the element selector.
	 *
	 * @returns   {?number[]}                                     Scroll position x and y values.
	 *
	 * @protected
	 */
	_getScrollValue(target) {
		let value;

		// A number representing the y-value given
		if (isNumeric(target)) {
			value = [0, target];

		// An array of x and y values given
		} else if (isArray(target)) {
			value = target;

		// HTML element or the element selector given
		} else {
			const element = getElement(target, this._scrollElement);
			if (!element) return null;

			if (this._options.element === 'auto') {
				this._scrollElement = getScrollableAncestor(element);
			}

			value = this._getElementScrollValue(element);
		}

		const [valueX, valueY] = value;

		const limitX = isElement(this._scrollElement)
			? this._scrollElement.scrollWidth - this._scrollElement.clientWidth
			: getScrollLimit('x');

		const limitY = isElement(this._scrollElement)
			? this._scrollElement.scrollHeight - this._scrollElement.clientHeight
			: getScrollLimit('y');

		let resultX = clamp(valueX, 0, limitX);
		let resultY = clamp(valueY, 0, limitY);

		if (this._options.ifNeeded) {
			const viewportRange = this._getViewportRange();
			const currentScroll = this._getCurrentScroll();

			const [vxMin, vxMax] = viewportRange.x;
			const [vyMin, vyMax] = viewportRange.y;

			if (resultX > vxMin && resultX < vxMax) {
				resultX = currentScroll[0];
			}

			if (resultY > vyMin && resultY < vyMax) {
				resultY = currentScroll[1];
			}
		}

		return [resultX, resultY];
	}

	/**
	 * Smoothly scrolls to a given position.
	 *
	 * @param     {number[]}            value              An array of target x and y scroll position.
	 * @param     {number|undefined}    [customDuration]   Custom scroll animation duration parameters, overrides the same option.
	 *
	 * @returns   {Promise<number[]>}                      Promise object representing the array of result x and y scroll position.
	 *
	 * @protected
	 */
	async _setScrollPosition(value, customDuration = undefined) {
		this._cancelScrolling();

		// Get parameters
		const [startX, startY] = this._getCurrentScroll();
		const [endX, endY] = value;

		const [changeX, changeY] = [endX - startX, endY - startY];
		const [deltaX, deltaY] = [changeX, changeY].map(v => Math.abs(v));

		const { easing } = this._options;
		const duration = this._getDuration(Math.max(deltaX, deltaY), customDuration);

		// Set scroll position
		return new Promise((resolve) => {
			let begin = null;
			const animate = (time) => {
				if (begin === null) begin = time;

				const progress = Math.min(time - begin, duration);

				const positionX = easing(progress, startX, changeX, duration);
				const adjustedX = Math[changeX > 0 ? 'min' : 'max'](positionX, endX);

				const positionY = easing(progress, startY, changeY, duration);
				const adjustedY = Math[changeY > 0 ? 'min' : 'max'](positionY, endY);

				this._scrollElement.scrollTo(adjustedX, adjustedY);

				if (
					   (changeX > 0 && adjustedX < endX) // scroll right not completed
					|| (changeX < 0 && adjustedX > endX) // scroll left not completed
					|| (changeY > 0 && adjustedY < endY) // scroll down not completed
					|| (changeY < 0 && adjustedY > endY) // scroll up not completed
				) {
					this._scrolling = window.requestAnimationFrame(animate);
				} else {
					this._cancelScrolling();
					window.requestAnimationFrame(() => resolve([endX, endY]));
				}
			};

			this._scrolling = window.requestAnimationFrame(animate);
		});
	}

	/**
	 * Smoothly scrolls to a given target.
	 *
	 * @param     {number|number[]|HTMLElement|string}   target      Scroll target: a number (y-value), an array of two numbers (x and y values), HTML element or the element selector.
	 * @param     {object}                               [options]   Custom options, extends the initial options for current invocation.
	 *
	 * @returns   {Promise<number[]>}                                Promise object representing the array of result x and y scroll position.
	 */
	async to(target, options = {}) {
		this._options = defaults(this._initialOptions, normalizeOptions(options));
		this._scrollElement = this._options.element === 'auto'
			? this._defaultScrollElement
			: this._options.element;

		return new Promise((resolve, reject) => {
			const dest = this._getScrollValue(target);
			if (isNullish(dest)) return reject(new Error('Invalid target element'));

			disablePageScroll();
			this._adjustPosition(dest);

			this._setScrollPosition(dest)
				.then(result => {
					const [destX, destY] = this._getScrollValue(target);
					const [resX, resY] = result;

					if (resX !== destX || resY !== destY) {
						return this._setScrollPosition([destX, destY], Math.min(100, this._getDuration(0)));
					}

					return result;
				})
				.then(result => {
					if (this._options.autofocus) {
						this._setFocus(getElement(target, this._scrollElement));
					}

					enablePageScroll();

					resolve(result);
				});
		});
	}

	/**
	 * Dynamically adds fixed elements after initialization.
	 *
	 * @param     {string}                    axis        Whether to add the elements to the `x` or `y` category of `fixedElements` option.
	 * @param     {string}                    alignment   Whether to add the elements to the `start` or `end` category of `fixedElements` option.
	 * @param     {...(HTMLElement|string)}   elements    The elements being added.
	 *
	 * @returns   {SmoothScroll}
	 */
	addFixedElements(axis, alignment, ...elements) {
		this._initialOptions.fixedElements[axis][alignment].push(...elements);
		return this;
	}

	/**
	 * Dynamically removes registered fixed elements.
	 *
	 * @param     {...(HTMLElement|string)}   elements   The elements being removed.
	 *
	 * @returns   {SmoothScroll}
	 */
	removeFixedElements(...elements) {
		const registeredElements = this._initialOptions.fixedElements;
		this._scrollElement = this._initialOptions.element === 'auto'
			? this._defaultScrollElement
			: this._initialOptions.element;

		this._initialOptions.fixedElements = Object.entries(registeredElements).reduce((acc, [_axis, _opts]) => {
			acc[_axis] = Object.entries(_opts).reduce((acc2, [_align, _stack]) => {
				acc2[_align] = _stack.filter((el) => {
					if (elements.includes(el)) {
						return false;
					}
					const element = getElement(el, this._scrollElement);
					return !!element && !elements.includes(element);
				});
				return acc2;
			}, {});
			return acc;
		}, {});

		return this;
	}
}

export { SmoothScroll };
