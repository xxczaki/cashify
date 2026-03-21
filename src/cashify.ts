import convert from './convert.ts';
import type { Options } from './lib/options.ts';

export default class Cashify {
	readonly options: Partial<Options>;

	constructor(options: Partial<Options>) {
		this.options = options;
	}

	convert(amount: number | string, options?: Partial<Options>): number {
		return convert(amount, { ...this.options, ...options } as Options);
	}
}
