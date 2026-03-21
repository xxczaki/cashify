import getRate from './lib/get-rate.ts';
import type { Options } from './lib/options.ts';
import parse from './utils/parser.ts';

export default function convert(
	amount: number | string,
	{ from, to, base, rates, BigJs }: Options,
): number {
	let numericAmount: number;
	let resolvedFrom = from;
	let resolvedTo = to;

	if (typeof amount === 'string') {
		const data = parse(amount);

		numericAmount = data.amount;
		resolvedFrom = data.from ?? from;
		resolvedTo = data.to ?? to;
	} else {
		numericAmount = amount;
	}

	if (Number.isNaN(numericAmount) || !Number.isFinite(numericAmount)) {
		throw new TypeError('The `amount` must be a finite number.');
	}

	if (BigJs) {
		return new BigJs(numericAmount)
			.times(getRate({ base, rates, from: resolvedFrom, to: resolvedTo }))
			.toNumber();
	}

	return (
		(numericAmount *
			100 *
			getRate({ base, rates, from: resolvedFrom, to: resolvedTo })) /
		100
	);
}
