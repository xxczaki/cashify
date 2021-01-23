import {Options} from './lib/options';
import convert from './convert';
import parse from './utils/parser';

export default class Cashify {
	/**
	* @constructor
	* @param {Object} [options] Conversion options.
	*/
	constructor(public readonly options: Partial<Options>) {}

	/**
	* Function, which converts currencies based on provided rates.
	*
	* @param {number | string} amount - Amount of money you want to convert.
	* @param {Object} [options] - Conversion options.
	* @return {number} Conversion result.
	*
	* @example
	* const rates = {
	* 	GBP: 0.92,
	* 	EUR: 1.00,
	* 	USD: 1.12
	* };
	*
	* const cashify = new Cashify({base: 'EUR', rates});
	*
	* cashify.convert(10, {from: 'EUR', to: 'GBP'}); //=> 9.2
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
