import { SmoothScroll } from './smooth-scroll.js';

class SmoothScrollNative extends SmoothScroll {
	/**
	 * Smoothly scrolls to a given position using the native `scrollTo` method.
	 *
	 * @param     {number[]}            value              An array of target x and y scroll position.
	 * @param     {number|undefined}    [customDuration]   Custom scroll animation duration. Just for signatures compatibility.
	 *
	 * @returns   {Promise<number[]>}                      Promise object representing the array of result x and y scroll position.
	 *
	 * @protected
	 */
	async _setScrollPosition(value, customDuration = undefined) {
		const self = this;
		const [endX, endY] = value;

		return new Promise((resolve) => {
			(function onScroll() {
				self._scrollElement.addEventListener('scroll', onScroll);
				const [nowX, nowY] = self._getCurrentScroll();

				if (Math.abs(nowX - endX) < 1 && Math.abs(nowY - endY) < 1) {
					self._scrollElement.removeEventListener('scroll', onScroll);
					resolve([endX, endY]);
				}
			})();

			if ('scrollBehavior' in document.documentElement.style) {
				self._scrollElement.scrollTo({ top: endY, left: endX, behavior: 'smooth' });
			} else {
				self._scrollElement.scrollTo();
			}
		});
	}
}

export { SmoothScrollNative };
