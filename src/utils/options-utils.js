import { createMergeObjects, isObject } from '@morev/helpers';

export const defaults = createMergeObjects((obj, key, value, stack) => {
	if (stack === 'offset') {
		obj[key] += value;
		return true;
	}
	return false;
});

export const normalizeOptions = (_options) => {
	if (isObject(_options.offset)) return _options;

	const options = { ..._options };
	options.offset = {
		x: options.offset?.x || 0,
		y: options.offset?.y || options.offset || 0,
	};
	return options;
};
