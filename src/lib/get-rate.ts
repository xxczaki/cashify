import type { Rates } from './options.ts';

interface GetRateOptions {
	base: string;
	rates: Rates;
	from: string | undefined;
	to: string | undefined;
}

export default function getRate({
	base,
	rates,
	from,
	to,
}: GetRateOptions): number {
	if (from && to) {
		if (from === to) {
			return 1;
		}

		if (from === base && Object.hasOwn(rates, to)) {
			return rates[to]!;
		}

		if (to === base && Object.hasOwn(rates, from)) {
			return 1 / rates[from]!;
		}

		if (Object.hasOwn(rates, from) && Object.hasOwn(rates, to)) {
			return rates[to]! * (1 / rates[from]!);
		}

		throw new TypeError(
			'The `rates` object does not contain either the `from` or `to` currency.',
		);
	}

	throw new TypeError(
		'Please specify the `from` and/or `to` currency, or use parsing.',
	);
}
