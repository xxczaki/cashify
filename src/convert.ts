import getRate from './lib/get-rate';
import {Options} from './lib/options';
import parse from './utils/parser';

/**
* @param amount Amount of money you want to convert.
* @param options Conversion options.
* @return Conversion result.
*/
export default function convert(amount: number | string, {from, to, base, rates}: Options): number {
	// If provided `amount` is a string, use parsing
	if (typeof amount === 'string') {
		const data = parse(amount);

		return (data.amount * 100) * getRate(base, rates, data.from ?? from, data.to ?? to) / 100;
	}

	return (amount * 100) * getRate(base, rates, from, to) / 100;
}
