'use strict';

interface Options {
	from: string;
	to: string;
	base: string;
	rates: object;
}

// Small helper for TypeScript
function hasKey<T>(obj: T, key: string | number | symbol): key is keyof T {
	return key in obj;
}

const getRate = (base: string, rates: object, from: string, to: string): number => {
	// If `from` equals `base`, return the basic exchange rate for the `to` currency
	if (from === base && hasKey(rates, to)) {
		return rates[to];
	}

	// If `to` equals `base`, return the basic inverse rate of the `from` currency
	if (to === base && hasKey(rates, from)) {
		return 1 / rates[from];
	}

	/**
		Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the
		relative exchange rate between the two currencies
	*/
	if (hasKey(rates, from) && hasKey(rates, to)) {
		return rates[to] * (1 / rates[from]);
	}

	throw new Error('`rates` object does not contain either `from` or `to` currency!');
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

		// If `from` equals `to`, return the amount of money
		if (from === to) {
			return amount;
		}

		return (amount * 100) * getRate(base, rates, from, to) / 100;
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
	// If `from` equals `to`, return the amount of money
	if (from === to) {
		return amount;
	}

	return (amount * 100) * getRate(base, rates, from, to) / 100;
};

export {
	Cashify,
	convert
};
