import getRate from './lib/get-rate.js';
import {Options} from './lib/options.js';
import parse from './utils/parser.js';

/**
 * Function, which converts currencies based on provided rates.
 *
 * @param {number | string} amount - Amount of money you want to convert.
 * @param {Object} options - Conversion options.
 * @param {new (value: BigSource) => Big} fn - Optional, Big.js constructor - useful to avoid floating point errors.
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
export default function convert(
	amount: number | string,
	{from, to, base, rates, BigJs}: Options,
): number {
	// If provided `amount` is a string, use parsing
	if (typeof amount === 'string') {
		const data = parse(amount);

		amount = data.amount;
		from = data.from ?? from;
		to = data.to ?? to;
	}

	if (BigJs) {
		return new BigJs(amount).times(getRate(base, rates, from, to)).toNumber();
	}

	return (amount * 100) * getRate(base, rates, from, to) / 100;
}
