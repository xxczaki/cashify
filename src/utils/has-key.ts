import {Rates} from '../lib/options.js';

/**
 * Check if an object contains a key.
 * @param obj The object to check.
 * @param key The key to check for.
*/
export default function hasKey<T>(object: Rates, key: string | number | symbol): key is keyof T {
	return Object.prototype.hasOwnProperty.call(object, key);
}
