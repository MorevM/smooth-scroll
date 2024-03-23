type Nullable<T> = T | null;
type AxisValue = 'x' | 'y';
type AlignValue = 'start' | 'center' | 'end';
type ScrollValue = [number, number];
type ScrollTarget = number | ScrollValue | HTMLElement | string;
type ScrollElement = HTMLElement | Window;

declare namespace SmoothScroll {
	interface IOptions {
		element?: ScrollElement | 'auto';
		duration?: number | [number, number];
		easing?: (time: number, begin: number, change: number, duration: number) => number;
		autofocus?: boolean;
		block?: AlignValue;
		inline?: AlignValue;
		offset?: {
			x?: number;
			y?: number;
		};
		fixedElements?: {
			x?: {
				start?: Array<HTMLElement | string>;
				end?: Array<HTMLElement | string>;
			};
			y?: {
				start?: Array<HTMLElement | string>;
				end?: Array<HTMLElement | string>;
			};
		};
	}
}

declare class SmoothScroll {
	/**
	 * Default options.
	 */
	protected _defaultOptions: Required<SmoothScroll.IOptions>;

	/**
	 * Initial options.
	 * Set while create new instance.
	 */
	protected _initialOptions: Required<SmoothScroll.IOptions>;

	/**
	 * Working options.
	 * Set during actions invoking.
	 */
	protected _options: Required<SmoothScroll.IOptions>;

	/**
	 * The element being scrolled.
	 */
	protected _scrollElement: ScrollElement;

	/**
	 * Default element being scrolled.
	 */
	protected _defaultScrollElement: ScrollElement;

	/**
	 * Scroll animation duration limit.
	 */
	protected _durationMax: number;

	/**
	 * RequestAnimationFrame storage.
	 */
	protected _scrolling: Nullable<number>;

	/**
	 * Initializes the class instance.
	 *
	 * @param   options   Custom options, extends the defaults.
	 */
	public constructor(options?: SmoothScroll.IOptions);

	/**
	 * Retrieves the adjusted scroll animation duration.
	 *
	 * @param   move             The needed scroll distance.
	 * @param   customDuration   Custom scroll animation duration parameters, overrides the same option.
	 *
	 * @returns                  The time in milliseconds that it should take to scroll a given distance.
	 */
	protected _getDuration(move?: number, customDuration?: number | [number, number]): number;

	/**
	 * Retrieves the element by a given selector, or just returns a given element as is.
	 *
	 * @param   value   Queried element selector or the element itself.
	 *
	 * @returns         The element being queried.
	 *
	 * @protected
	 */
	protected _getElement(value: any): Element | null;

	/**
	 * Retrieves the nearest scrollable ancestor element of a given element.
	 *
	 * @param   element   The element being evaluated.
	 *
	 * @returns           The nearest scrollable ancestor element of a given element, or the `window` object.
	 */
	protected _getScrollableAncestor(element: HTMLElement): ScrollElement;

	/**
	 * Adjusts current scroll position by increasing/decreasing it on 1px.
	 * To be sure that nearest sticky elements wil be considered on the needed scroll position values calculation.
	 *
	 * @param   value   An array of target x and y scroll position.
	 */
	protected _adjustPosition(value: ScrollValue): void;

	/**
	 * Sets focus on a given element.
	 *
	 * @param   element   The element to be focused.
	 *
	 * @returns           The element in focus.
	 */
	protected _setFocus(element: Nullable<HTMLElement>): Nullable<HTMLElement>;

	/**
	 * Prevents scroll by keyboard.
	 */
	protected _disableNativeScrollKeys(e: KeyboardEvent): void;

	/**
	 * Prevents scroll by mouse.
	 */
	protected _disableNativeScrollMouse(e: WheelEvent): void;

	/**
	 * Prevents scroll by touching.
	 */
	protected _disableNativeScrollTouch(e: TouchEvent): void;

	/**
	 * Disables native scroll interaction events.
	 */
	protected _disableNativeScroll(): void;

	/**
	 * Enables native scroll interaction events.
	 */
	protected _enableNativeScroll(): void;

	/**
	 * Cancels current scrolling animation.
	 */
	protected _cancelScrolling(): void;

	/**
	 * Adjusts a given scroll position considering the alignment options.
	 *
	 * @param   value     Scroll position x and y values.
	 * @param   element   The scroll target element.
	 *
	 * @returns           Adjusted scroll position values.
	 */
	protected _adjustScrollAlignment(value: ScrollValue, element: HTMLElement): ScrollValue;

	/**
	 * Adjusts a given scroll position considering the `scroll-margin-*` properties.
	 *
	 * @param   value     Scroll position x and y values.
	 * @param   element   The scroll target element.
	 *
	 * @returns           Adjusted scroll position values.
	 */
	protected _adjustScrollMargin(value: ScrollValue, element: HTMLElement): ScrollValue;

	/**
	 * Adjusts a given scroll position considering the `fixedElements` option.
	 *
	 * @param   value     Scroll position x and y values.
	 * @param   element   The scroll target element.
	 *
	 * @returns           Adjusted scroll position values.
	 */
	protected _adjustScrollFixedElements(value: ScrollValue, element: HTMLElement): ScrollValue;

	/**
	 * Adjusts a given scroll position considering the `offset` option.
	 *
	 * @param   value     Scroll position x and y values.
	 * @param   element   The scroll target element.
	 *
	 * @returns           Adjusted scroll position values.
	 */
	protected _adjustScrollOffset(value: ScrollValue, element: HTMLElement): ScrollValue;

	/**
	 * Retrieves the needed scroll position value (for both x and y axis) based on a given target element.
	 *
	 * @param                   element   Scroll target HTML element.
	 *
	 * @returns   {?number[]}             Scroll position x and y values.
	 */
	protected _getElementScrollValue(element: HTMLElement): ScrollValue;

	/**
	 * Retrieves the needed scroll position value (for both x and y axis) based on a given target.
	 *
	 * @param   target   Scroll target: y-value, an array of x and y values, HTML element or the element selector.
	 *
	 * @returns          Scroll position x and y values.
	 */
	protected _getScrollValue(target: ScrollTarget): Nullable<ScrollValue>;

	/**
	 * Smoothly scrolls to a given position.
	 *
	 * @param   value            An array of target x and y scroll position.
	 * @param   customDuration   Custom scroll animation duration parameters, overrides the same option.
	 *
	 * @returns                  Promise object representing the array of result x and y scroll position.
	 */
	protected _setScrollPosition(value: ScrollValue, customDuration?: number): Promise<ScrollValue>;

	/**
	 * Smoothly scrolls to a given target.
	 *
	 * @param   target    Scroll target: a number (y-value), an array of two numbers (x and y values), HTML element or the element selector.
	 * @param   options   Custom options, extends the initial options for current invocation.
	 *
	 * @returns           Promise object representing the array of result x and y scroll position.
	 */
	public to(target: ScrollTarget, options?: SmoothScroll.IOptions): Promise<ScrollValue>;

	/**
	 * Dynamically adds fixed elements after initialization.
	 *
	 * @param   axis        Whether to add the elements to the `x` or `y` category of `fixedElements` option.
	 * @param   alignment   Whether to add the elements to the `start` or `end` category of `fixedElements` option.
	 * @param   elements    The elements being added.
	 */
	public addFixedElements(
		axis: AxisValue,
		alignment: AlignValue,
		...elements: Array<HTMLElement | string>
	): SmoothScroll;

	/**
	 * Dynamically removes registered fixed elements.
	 *
	 * @param   elements   The elements being removed.
	 */
	public removeFixedElements(...elements: Array<HTMLElement | string>): SmoothScroll;
}

export { SmoothScroll };
