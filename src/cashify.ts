import {Options} from './lib/options';
import convert from './convert';
import parse from './utils/parser';

export default class Cashify {
	constructor(public readonly options: Partial<Options>) { }

	/**
	* @param amount Amount of money you want to convert.
	* @param options Conversion options.
	* @return Conversion result.
	*/
	convert(amount: number | string, options?: Partial<Options>): number {
		// If provided `amount` is a string, use parsing
		if (typeof amount === 'string') {
			const data = parse(amount);

			return convert(data.amount, {...this.options, from: data.from, to: data.to, ...options} as Options);
		}

		return convert(amount, {...this.options, ...options} as Options);
	}
}
