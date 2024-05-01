import type { NonEmptyArray } from '@morev/utils';
import { clamp, getElement, getElementOffset, getScrollLimit, isArray, isElement, isNullish, isNumeric, getScrollableAncestor, tsObject, isString } from '@morev/utils';
import { disablePageScroll, enablePageScroll } from '../utils/scroll-utils';
import { defaults, normalizeOptions } from '../utils/options-utils';
import type { Axis, Options, PartialOptions, ScrollTarget, ScrollValue, _FixedElementOffsets, _FixedElements, _NormalizedOptions } from '../types';
import { DEFAULT_OPTIONS } from './constants';

class SmoothScroll {
	/**
	 * Default options.
	 *
	 * @protected
	 */
	protected readonly defaultOptions: Options = DEFAULT_OPTIONS;

	/**
	 * Initial options.
	 * Set while create new instance.
	 *
	 * @private
	 */
	private readonly initializationOptions: _NormalizedOptions = {} as unknown as _NormalizedOptions;

	/**
	 * Working options.
	 * Set during actions invoking.
	 *
	 * @private
	 */
	private options: _NormalizedOptions = { ...DEFAULT_OPTIONS };

	/**
	 * The element being scrolled.
	 *
	 * @protected
	 */
	protected scrollElement: HTMLElement | Window | null = null;

	/**
	 * Default element being scrolled.
	 *
	 * @protected
	 */
	protected defaultScrollElement = window;

	/**
	 * Scroll animation duration limit.
	 *
	 * @protected
	 */
	protected durationMax = 2000;

	/**
	 * RequestAnimationFrame storage.
	 *
	 * @private
	 */
	private scrolling: number | null = null;

	/**
	 * Initializes class instance.
	 *
	 * @param   userOptions   Custom options, extends the defaults.
	 */
	public constructor(userOptions: PartialOptions = {}) {
		this.initializationOptions = defaults(this.defaultOptions, normalizeOptions(userOptions)) as _NormalizedOptions;
	}

	/**
	 * Retrieves the adjusted scroll animation duration.
	 *
	 * @param   distance         The needed scroll distance.
	 * @param   customDuration   Custom scroll animation duration parameters, overrides the same option.
	 *
	 * @returns                  The time in milliseconds that it should take to scroll a given distance.
	 *
	 * @protected
	 */
	protected getDuration(distance: number, customDuration?: number | ScrollValue) {
		const [duration, max = this.durationMax] = [customDuration ?? this.options.duration].flat();
		const k = Math.max(1, Math.abs(Math.round(distance / 1000)));

		return clamp(duration * k, 1, max);
	}

	/**
	 * Calculates the registered fixed elements sizes.
	 *
	 * @returns   An object structured as `fixedElements` option, containing sum of fixed elements sizes.
	 *
	 * @protected
	 */
	protected calcFixedElements() {
		return tsObject.entries(this.options.fixedElements).reduce<_FixedElementOffsets>((acc, [_axis, _opts]) => {
			acc[_axis] = tsObject.entries(_opts).reduce<_FixedElementOffsets['x']>((acc2, [_align, _stack]) => {
				acc2[_align] = _stack
					.map((el) => getElement<HTMLElement>(el, this.scrollElement))
					.filter((n, i, arr) => Boolean(n) && arr.indexOf(n) === i)
					.reduce((sum, el) => {
						if (!el) return sum;
						sum += _axis === 'x' ? el.offsetWidth : el.offsetHeight;
						return sum;
					}, 0);
				return acc2;
			}, { start: 0, end: 0 });
			return acc;
		}, { x: { start: 0, end: 0 }, y: { start: 0, end: 0 } });
	}

	/**
	 * Retrieves the current scroll position of the scrollable element.
	 *
	 * @returns   A tuple containing current `x` and `y` scroll position.
	 *
	 * @protected
	 */
	protected getCurrentScroll() {
		const scrollX = isElement(this.scrollElement)
			? this.scrollElement.scrollLeft
			: window.scrollX ?? window.pageXOffset;

		const scrollY = isElement(this.scrollElement)
			? this.scrollElement.scrollTop
			: window.scrollY ?? window.pageYOffset;

		return [scrollX, scrollY] as const;
	}

	/**
	 * Retrieves the ranges of scroll values that are in the viewport now.
	 *
	 * @returns   An object of scroll values ranges (x and y).
	 *
	 * @protected
	 */
	protected getViewportRange() {
		let [startX, startY] = this.getCurrentScroll();

		let endX = startX + (isElement(this.scrollElement) ? this.scrollElement.offsetWidth : window.innerWidth);
		let endY = startY + (isElement(this.scrollElement) ? this.scrollElement.offsetHeight : window.innerHeight);

		const fixedValues = this.calcFixedElements();

		startX += fixedValues.x.start;
		startY += fixedValues.y.start;

		endX -= fixedValues.x.end;
		endY -= fixedValues.y.end;

		return {
			x: [startX, endX] as const,
			y: [startY, endY] as const,
		};
	}

	/**
	 * Adjusts current scroll position by increasing/decreasing it on 1px.
	 * To be sure that nearest sticky elements wil be considered on the needed scroll position values calculation.
	 *
	 * @param   value   An array of target x and y scroll position.
	 *
	 * @protected
	 */
	protected adjustPosition(value: ScrollValue) {
		const [startX, startY] = this.getCurrentScroll();
		const [endX, endY] = value;

		const [changeX, changeY] = [endX - startX, endY - startY];
		const [deltaX, deltaY] = [changeX, changeY].map((v) => Math.abs(v));

		const adjustX = startX + (deltaX > 1 ? changeX / deltaX : 0);
		const adjustY = startY + (deltaY > 1 ? changeY / deltaY : 0);

		this.scrollElement?.scrollTo(adjustX, adjustY);
	}

	/**
	 * Sets focus on a given element.
	 *
	 * @param   element   The element to be focused.
	 *
	 * @protected
	 */
	protected setFocus(element?: HTMLElement | null) {
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
	 * @private
	 */
	private cancelScrolling() {
		if (this.scrolling !== null) {
			window.cancelAnimationFrame(this.scrolling);
		}

		this.scrolling = null;
	}

	/**
	 * Adjusts a given scroll position considering the alignment options.
	 *
	 * @param   value     Scroll position `x` and `y` values.
	 * @param   element   The scroll target element.
	 *
	 * @returns           Adjusted scroll position values.
	 *
	 * @protected
	 */
	protected adjustScrollAlignment(value: ScrollValue, element: HTMLElement) {
		let [valueX, valueY] = value;

		const elementWidth = element.offsetWidth;
		const elementHeight = element.offsetHeight;

		const scrollableWidth = isElement(this.scrollElement) ? this.scrollElement.clientWidth : window.innerWidth;
		const scrollableHeight = isElement(this.scrollElement) ? this.scrollElement.clientHeight : window.innerHeight;

		switch (this.options.inline) {
			case 'end':
				valueX += elementWidth;
				valueX -= scrollableWidth;
				break;

			case 'center':
				valueX += elementWidth / 2;
				valueX -= scrollableWidth / 2;
				break;

			default: break;
		}

		switch (this.options.block) {
			case 'end':
				valueY += elementHeight;
				valueY -= scrollableHeight;
				break;

			case 'center':
				valueY += elementHeight / 2;
				valueY -= scrollableHeight / 2;
				break;

			default: break;
		}

		return [valueX, valueY];
	}

	/**
	 * Adjusts a given scroll position considering the `scroll-margin-*` properties.
	 *
	 * @param   value     Scroll position `x` and `y` values.
	 * @param   element   The scroll target element.
	 *
	 * @returns           Adjusted scroll position values.
	 *
	 * @protected
	 */
	protected adjustScrollMargin(value: ScrollValue, element: HTMLElement) {
		let [valueX, valueY] = value;

		const styles = window.getComputedStyle(element);
		const marginTop = parseInt(styles.getPropertyValue('scroll-margin-top') || '0', 10);
		const marginRight = parseInt(styles.getPropertyValue('scroll-margin-right') || '0', 10);
		const marginBottom = parseInt(styles.getPropertyValue('scroll-margin-bottom') || '0', 10);
		const marginLeft = parseInt(styles.getPropertyValue('scroll-margin-left') || '0', 10);

		switch (this.options.inline) {
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

			default: break;
		}

		switch (this.options.block) {
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

			default: break;
		}

		return [valueX, valueY] as const;
	}

	/**
	 * Adjusts a given scroll position considering the `fixedElements` option.
	 *
	 * @param   value   Scroll position x and y values.
	 *
	 * @returns         Adjusted scroll position values.
	 *
	 * @protected
	 */
	protected adjustScrollFixedElements(value: ScrollValue) {
		let [valueX, valueY] = value;
		const fixedValues = this.calcFixedElements();

		switch (this.options.inline) {
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

			default: break;
		}

		switch (this.options.block) {
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

			default: break;
		}

		return [valueX, valueY] as const;
	}

	/**
	 * Adjusts a given scroll position considering the `offset` option.
	 *
	 * @param   value   Scroll position `x` and `y` values.
	 *
	 * @returns         Adjusted scroll position values.
	 *
	 * @protected
	 */
	protected adjustScrollOffset(value: ScrollValue) {
		let [valueX, valueY] = value;

		valueX += this.options.offset.x;
		valueY += this.options.offset.y;

		return [valueX, valueY] as const;
	}

	/**
	 * Retrieves the needed scroll position value (for both x and y axis) based on a given target element.
	 *
	 * @param   element   Scroll target HTML element.
	 *
	 * @returns           Scroll position `x` and `y` values.
	 *
	 * @protected
	 */
	protected getElementScrollValue(element: HTMLElement) {
		let { x: valueX, y: valueY } = getElementOffset(element, 'both', this.scrollElement);

		[valueX, valueY] = this.adjustScrollAlignment([valueX, valueY], element);
		[valueX, valueY] = this.adjustScrollMargin([valueX, valueY], element);
		[valueX, valueY] = this.adjustScrollFixedElements([valueX, valueY]);
		[valueX, valueY] = this.adjustScrollOffset([valueX, valueY]);

		return [valueX, valueY] as const;
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
	protected getScrollValue(target: number | ScrollValue | HTMLElement | string) {
		let value;

		// A number representing the y-value given
		if (isNumeric(target)) {
			value = [0, target];

		// An array of x and y values given
		} else if (isArray(target)) {
			value = target;

		// HTML element or the element selector given
		} else {
			const element = getElement<HTMLElement>(target, this.scrollElement);
			if (!element) return null;

			if (this.options.element === 'auto') {
				this.scrollElement = getScrollableAncestor<HTMLElement>(element);
			}

			value = this.getElementScrollValue(element);
		}

		const [valueX, valueY] = value;

		const limitX = isElement(this.scrollElement)
			? this.scrollElement.scrollWidth - this.scrollElement.clientWidth
			: getScrollLimit('x');

		const limitY = isElement(this.scrollElement)
			? this.scrollElement.scrollHeight - this.scrollElement.clientHeight
			: getScrollLimit('y');

		let resultX = clamp(valueX, 0, limitX);
		let resultY = clamp(valueY, 0, limitY);

		if (this.options.ifNeeded) {
			const viewportRange = this.getViewportRange();
			const currentScroll = this.getCurrentScroll();

			const [vxMin, vxMax] = viewportRange.x;
			const [vyMin, vyMax] = viewportRange.y;

			if (resultX > vxMin && resultX < vxMax) {
				resultX = currentScroll[0];
			}

			if (resultY > vyMin && resultY < vyMax) {
				resultY = currentScroll[1];
			}
		}

		return [resultX, resultY] as ScrollValue;
	}

	/**
	 * Smoothly scrolls to a given position.
	 *
	 * @param   value            An array of target x and y scroll position.
	 * @param   customDuration   Custom scroll animation duration parameters, overrides the same option.
	 *
	 * @returns                  Promise object representing the array of result x and y scroll position.
	 *
	 * @protected
	 */
	protected async setScrollPosition(value: ScrollValue, customDuration?: number): Promise<ScrollValue> {
		this.cancelScrolling();

		// Get parameters
		const [startX, startY] = this.getCurrentScroll();
		const [endX, endY] = value;

		const [changeX, changeY] = [endX - startX, endY - startY];
		const [deltaX, deltaY] = [changeX, changeY].map((v) => Math.abs(v));

		const { easing } = this.options;
		const duration = this.getDuration(Math.max(deltaX, deltaY), customDuration);

		// Set scroll position
		return new Promise((resolve) => {
			let begin: number | null = null;
			const animate = (time: number) => {
				if (begin === null) begin = time;

				const progress = Math.min(time - begin, duration);

				const positionX = easing(progress, startX, changeX, duration);
				const adjustedX = Math[changeX > 0 ? 'min' : 'max'](positionX, endX);

				const positionY = easing(progress, startY, changeY, duration);
				const adjustedY = Math[changeY > 0 ? 'min' : 'max'](positionY, endY);

				this.scrollElement?.scrollTo(adjustedX, adjustedY);

				if (
					   (changeX > 0 && adjustedX < endX) // scroll right not completed
					|| (changeX < 0 && adjustedX > endX) // scroll left not completed
					|| (changeY > 0 && adjustedY < endY) // scroll down not completed
					|| (changeY < 0 && adjustedY > endY) // scroll up not completed
				) {
					this.scrolling = window.requestAnimationFrame(animate);
				} else {
					this.cancelScrolling();
					window.requestAnimationFrame(() => resolve([endX, endY]));
				}
			};

			this.scrolling = window.requestAnimationFrame(animate);
		});
	}

	/**
	 * Smoothly scrolls to a given target.
	 *
	 * @param   target    Scroll target: a number (y-value), an array of two numbers (x and y values), HTML element or the element selector.
	 * @param   options   Custom options, extends the initial options for current invocation.
	 *
	 * @returns           Promise object representing the array of result x and y scroll position.
	 */
	public async to(target: ScrollTarget, options: PartialOptions = {}): Promise<ScrollValue> {
		this.options = defaults(this.initializationOptions ?? {}, normalizeOptions(options)) as _NormalizedOptions;
		this.scrollElement = this.options.element === 'auto'
			? this.defaultScrollElement
			: this.options.element;

		return new Promise((resolve, reject) => {
			const dest = this.getScrollValue(target);
			if (isNullish(dest)) return reject(new Error('Invalid target element'));

			disablePageScroll();
			this.adjustPosition(dest);

			document.documentElement.style.setProperty('scroll-behavior', 'auto');
			if (isElement(this.scrollElement)) {
				this.scrollElement.style.setProperty('scroll-behavior', 'auto');
			}

			this.setScrollPosition(dest)
				.then((result) => {
					const scrollValue = this.getScrollValue(target);
					if (!scrollValue) return result;

					const [destX, destY] = scrollValue;
					const [resX, resY] = result;

					if (resX !== destX || resY !== destY) {
						return this.setScrollPosition([destX, destY], Math.min(100, this.getDuration(0)));
					}

					return result;
				})
				.then((result) => {
					if (this.options.autofocus && (isString(target) || isElement(target))) {
						this.setFocus(getElement<HTMLElement>(target, this.scrollElement));
					}

					document.documentElement.style.removeProperty('scroll-behavior');

					if (isElement(this.scrollElement)) {
						this.scrollElement.style.removeProperty('scroll-behavior');
					}

					enablePageScroll();

					resolve(result);
				});
		});
	}

	/**
	 * Dynamically adds fixed elements after initialization.
	 *
	 * @param   axis        Whether to add the elements to the `x` or `y` category of `fixedElements` option.
	 * @param   alignment   Whether to add the elements to the `start` or `end` category of `fixedElements` option.
	 * @param   elements    The elements being added.
	 *
	 * @returns             Class instance.
	 */
	public addFixedElements(axis: Axis, alignment: 'start' | 'end', ...elements: NonEmptyArray<HTMLElement | string>) {
		this.initializationOptions?.fixedElements[axis][alignment].push(...elements);
		return this;
	}

	/**
	 * Dynamically removes registered fixed elements.
	 *
	 * @param   elements   The elements being removed.
	 *
	 * @returns            Self instance.
	 */
	public removeFixedElements(...elements: NonEmptyArray<HTMLElement | string>) {
		const registeredElements = this.initializationOptions.fixedElements
			?? { x: { start: [], end: [] }, y: { start: [], end: [] } };

		this.scrollElement = this.initializationOptions.element === 'auto'
			? this.defaultScrollElement
			: this.initializationOptions.element;

		this.initializationOptions.fixedElements = tsObject.entries(registeredElements)
			.reduce<_FixedElements>(
			(acc, [_axis, _opts]) => {
				acc[_axis] = tsObject.entries(_opts).reduce((acc2, [_align, _stack]) => {
					acc2[_align] = _stack.filter((el) => {
						if (elements.includes(el)) return false;
						const element = getElement<HTMLElement>(el, this.scrollElement);
						return !!element && !elements.includes(element);
					});

					return acc2;
				}, { start: [] as Array<string | HTMLElement>, end: [] as Array<string | HTMLElement> });

				return acc;
			}, { x: { start: [], end: [] }, y: { start: [], end: [] } },
		);

		return this;
	}
}

export { SmoothScroll };
