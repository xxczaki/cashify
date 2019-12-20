/**
 * Check if an object contains a key.
 * @param obj The object to check.
 * @param key The key to check for.
*/
export default function hasKey<T>(obj: T, key: string | number | symbol): key is keyof T {
	return key in obj;
}
