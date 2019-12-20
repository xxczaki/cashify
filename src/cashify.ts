import {Options} from './lib/options';
import convert from './convert';

export default class Cashify {
	constructor(public readonly options: Partial<Options>) { }

	/**
	* @param amount Amount of money you want to convert.
	* @param options Conversion options.
	* @return Conversion result.
	*/
	convert(amount: number, options?: Partial<Options>): number {
		return convert(amount, {...this.options, ...options} as Options);
	}
}
