import getRate from './lib/get-rate';
import {Options} from './lib/options';

/**
* @param amount Amount of money you want to convert.
* @param options Conversion options.
* @return Conversion result.
*/
export default function convert(amount: number, {from, to, base, rates}: Options): number {
	return (amount * 100) * getRate(base, rates, from, to) / 100;
}
