import type { ScrollValue } from '../types';
import { SmoothScroll } from './smooth-scroll';

class SmoothScrollNative extends SmoothScroll {
	/**
	 * Smoothly scrolls to a given position using the native `scrollTo` method.
	 *
	 * @param   value            An array of target x and y scroll position.
	 * @param   customDuration   Custom scroll animation duration. Just for signatures compatibility.
	 *
	 * @returns                  Promise object representing the array of result `x` and `y` scroll position.
	 *
	 * @protected
	 */
	protected async setScrollPosition(value: ScrollValue, customDuration?: number): Promise<ScrollValue> {
		const self = this;
		const [endX, endY] = value;

		return new Promise((resolve) => {
			(function onScroll() {
				self.scrollElement?.addEventListener('scroll', onScroll);
				const [nowX, nowY] = self.getCurrentScroll();

				if (Math.abs(nowX - endX) < 1 && Math.abs(nowY - endY) < 1) {
					self.scrollElement?.removeEventListener('scroll', onScroll);
					resolve([endX, endY]);
				}
			})();

			if ('scrollBehavior' in document.documentElement.style) {
				self.scrollElement?.scrollTo({ top: endY, left: endX, behavior: 'smooth' });
			} else {
				self.scrollElement?.scrollTo();
			}
		});
	}
}

export { SmoothScrollNative };
