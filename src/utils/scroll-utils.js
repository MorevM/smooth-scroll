import { supportsPassive } from '@morev/helpers';

const KEYS_AFFECTING_SCROLL = [
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'PageUp',
	'PageDown',
	'Home',
	'End',
	'Space',
];

const preventMiddleMouseButton = (e) => e.button === 1 && e.preventDefault();
const preventEvent = (e) => e.preventDefault();
const preventScrollByKeyboard = (e) => KEYS_AFFECTING_SCROLL.includes(e.code) && e.preventDefault();

/**
 * Disables native scroll interaction events.
 *
 * @returns   {void}
 */
export const disablePageScroll = () => {
	const passive = supportsPassive() ? { passive: false } : false;

	window.addEventListener('mousedown', preventMiddleMouseButton);
	window.addEventListener('keydown', preventScrollByKeyboard);
	window.addEventListener('wheel', preventEvent, passive);
	window.addEventListener('touchmove', preventEvent, passive);
};

/**
 * Enables native scroll interaction events.
 *
 * @returns   {void}
 */
export const enablePageScroll = () => {
	window.removeEventListener('mousedown', preventMiddleMouseButton);
	window.removeEventListener('keydown', preventScrollByKeyboard);
	window.removeEventListener('wheel', preventEvent);
	window.removeEventListener('touchmove', preventEvent);
};
