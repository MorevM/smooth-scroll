import { createMergeObjects, isObject } from '@morev/utils';
import type { PartialOptions } from '../types';

export const defaults = createMergeObjects((obj, key, value, stack) => {
	if (stack === 'offset') {
		/* @ts-expect-error -- nvm */
		obj[key] += value;
		return true;
	}
	return false;
});

export const normalizeOptions = (_options: PartialOptions) => {
	if (isObject(_options.offset)) return _options;

	return {
		..._options,
		offset: { x: 0, y: _options.offset ?? 0 },
	};
};
