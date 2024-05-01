import { easeInOutQuad } from 'js-easing-functions';
import type { _NormalizedOptions } from '../types';

export const DEFAULT_OPTIONS: _NormalizedOptions = {
	element: 'auto' as const,
	duration: [300, 700] as const,
	easing: easeInOutQuad,
	ifNeeded: false,
	autofocus: false,
	block: 'start' as const,
	inline: 'start' as const,
	offset: { x: 0, y: 0 },
	fixedElements: {
		x: { start: [], end: [] },
		y: { start: [], end: [] },
	},
};
