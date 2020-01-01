import getRate from './lib/get-rate';
import {Options} from './lib/options';

/**
* @param amount Amount of money you want to convert.
* @param options Conversion options.
* @return Conversion result.
*/
export default function convert(amount: number | string, {from, to, base, rates}: Options): number {
	// If provided `amount` is a string, get the right amount and detect the `from` currency
	if (typeof amount === 'string') {
		from = amount.replace(/(?<currency_code>[^A-Za-z])/g, '');
		amount = parseFloat(amount.replace(/[^0-9-.]/g, ''));

		return (amount * 100) * getRate(base, rates, from, to) / 100;
	}

	return (amount * 100) * getRate(base, rates, from, to) / 100;
}
