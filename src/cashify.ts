import {Options} from './lib/options.js';
import convert from './convert.js';

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
		return convert(amount, {...this.options, ...options} as Options);
	}
}
