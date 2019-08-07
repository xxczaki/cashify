'use strict';

interface Options {
	from: string;
	to: string;
	base: string;
	rates: object;
}

const getRate = ({base, rates, from, to}: Options): number => {
	// If `from` equals `base` or `from` equals `to`, return the basic exchange rate for the `to` currency
	if (from === base || from === to) {
		// @ts-ignore
		return rates[to];
	}

	// If `to` equals `base`, return the basic inverse rate of the `from` currency
	if (to === base) {
		// @ts-ignore
		return 1 / rates[from];
	}

	/**
		Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the
		relative exchange rate between the two currencies
		*/
	// @ts-ignore
	return rates[to] * (1 / rates[from]);
};

class Cashify {
	/**
	* @param {string} base Base currency
	* @param {object} rates Object containing currency rates (for example from an API, such as Open Exchange Rates)
	*/

	public readonly options: Omit<Options, 'from' | 'to'>;

	constructor({base, rates}: Omit<Options, 'from' | 'to'>) {
		this.options = {
			base,
			rates
		};
	}

	/**
	* @param {number} amount Amount of money you want to convert
	* @param {object} options Conversion options
	* @param {string} options.from Currency from which you want to convert
	* @param {string} options.to Currency to which you want to convert
	* @return {number} Conversion result
	*/
	convert(amount: number, {from, to}: Omit<Options, 'base' | 'rates'>): number {
		const {base, rates} = this.options;

		return amount * getRate({base, rates, from, to});
	}
}

/**
* @param {number} amount Amount of money you want to convert
* @param {object} options Conversion options
* @param {string} options.from Currency from which you want to convert
* @param {string} options.to Currency to which you want to convert
* @param {string} options.base Base currency
* @param {string} options.rates Object containing currency rates (for example from an API, such as Open Exchange Rates)
* @return {number} Conversion result
*/
const convert = (amount: number, {from, to, base, rates}: Options): number => {
	return amount * getRate({base, rates, from, to});
};

export {
	Cashify,
	convert
};
