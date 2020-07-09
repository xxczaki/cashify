import hasKey from '../utils/has-key';
import {Rates} from './options';

/**
 * Get the conversion rate.
 * @param base Base currency.
 * @param rates Object containing currency rates (for example from an API, such as Open Exchange Rates).
 * @param from Currency from which you want to convert.
 * @param to Currency to which you want to convert.
 * @return Conversion result.
*/
export default function getRate(base: string, rates: Rates, from: string | undefined, to: string | undefined): number {
	if (from && to) {
		// If `from` equals `to`, return 100% directly
		if (from === to) {
			return 1;
		}

		// If `from` equals `base`, return the basic exchange rate for the `to` currency
		if (from === base && hasKey(rates, to)) {
			return rates[to];
		}

		// If `to` equals `base`, return the basic inverse rate of the `from` currency
		if (to === base && hasKey(rates, from)) {
			return 1 / rates[from];
		}

		// Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the relative exchange rate between the two currencies.
		if (hasKey(rates, from) && hasKey(rates, to)) {
			return rates[to] * (1 / rates[from]);
		}

		throw new Error('`rates` object does not contain either `from` or `to` currency!');
	} else {
		throw new Error('Please specify the `from` and/or `to` currency or use parsing!');
	}
}
