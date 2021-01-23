import getRate from './lib/get-rate';
import {Options} from './lib/options';
import parse from './utils/parser';

/**
 * Function, which converts currencies based on provided rates.
 *
 * @param {number | string} amount - Amount of money you want to convert.
 * @param {Object} options - Conversion options.
 * @return {number} Conversion result.
 *
 * @example
 * const rates = {
 * 	GBP: 0.92,
 * 	EUR: 1.00,
 * 	USD: 1.12
 * };
 *
 * convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}); //=> 9.2
 */
export default function convert(amount: number | string, {from, to, base, rates}: Options): number {
	// If provided `amount` is a string, use parsing
	if (typeof amount === 'string') {
		const data = parse(amount);

		return (data.amount * 100) * getRate(base, rates, data.from ?? from, data.to ?? to) / 100;
	}

	return (amount * 100) * getRate(base, rates, from, to) / 100;
}
