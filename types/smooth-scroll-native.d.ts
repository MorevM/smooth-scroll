import { SmoothScroll } from './smooth-scroll';

type ScrollValue = [number, number];
declare namespace SmoothScrollNative {
	interface IOptions extends SmoothScroll.IOptions {}
}

declare class SmoothScrollNative extends SmoothScroll {
	/**
	 * Smoothly scrolls to a given position using the native `scrollTo` method.
	 *
	 * @param   value            An array of target x and y scroll position.
	 * @param   customDuration   Custom scroll animation duration. Just for signatures compatibility.
	 *
	 * @returns                  Promise object representing the array of result x and y scroll position.
	 */
	protected _setScrollPosition(value: ScrollValue, customDuration?: number): Promise<ScrollValue>;
}

export { SmoothScrollNative };
