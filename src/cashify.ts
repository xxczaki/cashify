import {Options} from './lib/options';
import convert from './convert';

export default class Cashify {
	constructor(public readonly options: Partial<Options>) { }

	/**
	* @param amount Amount of money you want to convert.
	* @param options Conversion options.
	* @return Conversion result.
	*/
	convert(amount: number | string, options?: Partial<Options>): number {
		// If provided `amount` is a string, get the right amount and detect the `from` currency
		if (typeof amount === 'string') {
			const from = amount.replace(/(?<currency_code>[^A-Za-z])/g, '');
			amount = parseFloat(amount.replace(/[^0-9-.]/g, ''));

			return convert(amount, {...this.options, from, ...options} as Options);
		}

		return convert(amount, {...this.options, ...options} as Options);
	}
}
