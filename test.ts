import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Big from 'big.js';
import { Cashify, convert, parse } from './src/index.ts';

const rates = {
	GBP: 0.92,
	EUR: 1,
	USD: 1.12,
};

describe('Cashify constructor', () => {
	it('exports a constructor', () => {
		const cashify = new Cashify({ base: 'EUR', rates });
		assert.strictEqual(
			cashify.convert(12, { from: 'USD', to: 'GBP' }),
			9.857_142_857_142_856,
		);
	});
});

describe('parse', () => {
	it('exports a parse function', () => {
		assert.deepStrictEqual(parse('10 eur to pln'), {
			amount: 10,
			from: 'EUR',
			to: 'PLN',
		});
	});
});

describe('convert', () => {
	it('basic conversion', () => {
		assert.strictEqual(
			convert(12, { from: 'USD', to: 'GBP', base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
	});

	it('from equals base', () => {
		assert.strictEqual(
			convert(10, { from: 'EUR', to: 'GBP', base: 'EUR', rates }),
			9.2,
		);
	});

	it('to equals base', () => {
		assert.strictEqual(
			convert(10, { from: 'GBP', to: 'EUR', base: 'EUR', rates }),
			10.869_565_217_391_303,
		);
	});

	it('from equals to', () => {
		assert.strictEqual(
			convert(10, { from: 'USD', to: 'USD', base: 'EUR', rates }),
			10,
		);
	});

	it('from equals to but base is different', () => {
		assert.strictEqual(
			convert(10, { from: 'EUR', to: 'EUR', base: 'USD', rates }),
			10,
		);
	});

	it('accepts amount of type string', () => {
		assert.strictEqual(
			convert('12', { from: 'USD', to: 'GBP', base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
	});

	it('edge case: string amount equal to 0', () => {
		assert.strictEqual(
			convert('0', { from: 'USD', to: 'GBP', base: 'EUR', rates }),
			0,
		);
	});

	it('amount equals 0', () => {
		assert.strictEqual(
			convert(0, { from: 'USD', to: 'GBP', base: 'EUR', rates }),
			0,
		);
	});
});

describe('parsing integration', () => {
	it('basic parsing (integer)', () => {
		assert.strictEqual(
			convert('$12 USD', { to: 'GBP', base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
	});

	it('basic parsing (float)', () => {
		assert.strictEqual(
			convert('1.23 GBP', { to: 'EUR', base: 'USD', rates }),
			1.336_956_521_739_130_4,
		);
	});

	it('parsing without the from currency (integer)', () => {
		assert.strictEqual(
			convert('12 to GBP', { from: 'USD', base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
	});

	it('full parsing (integer)', () => {
		assert.strictEqual(
			convert('$12 USD TO GBP', { base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
		assert.strictEqual(
			convert('$12 USD IN GBP', { base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
		assert.strictEqual(
			convert('$12 USD AS GBP', { base: 'EUR', rates }),
			9.857_142_857_142_856,
		);
	});

	it('full parsing (float)', () => {
		assert.strictEqual(
			convert('1.23 gbp to eur', { base: 'USD', rates }),
			1.336_956_521_739_130_4,
		);
		assert.strictEqual(
			convert('1.23 gbp in eur', { base: 'USD', rates }),
			1.336_956_521_739_130_4,
		);
		assert.strictEqual(
			convert('1.23 gbp as eur', { base: 'USD', rates }),
			1.336_956_521_739_130_4,
		);
	});
});

describe('error handling', () => {
	it('throws when from is not defined', () => {
		assert.throws(() => convert(10, { to: 'EUR', base: 'USD', rates }), {
			message:
				'Please specify the `from` and/or `to` currency, or use parsing.',
		});
	});

	it('rates without the base currency', () => {
		const ratesWithoutBase = { GBP: 0.92, USD: 1.12 };
		assert.strictEqual(
			convert(10, {
				from: 'EUR',
				to: 'GBP',
				base: 'EUR',
				rates: ratesWithoutBase,
			}),
			9.2,
		);
	});

	it('throws when rates missing from or to currency', () => {
		assert.throws(
			() => convert(10, { from: 'CHF', to: 'EUR', base: 'EUR', rates }),
			{
				message:
					'The `rates` object does not contain either the `from` or `to` currency.',
			},
		);
	});

	it('throws on empty string amount', () => {
		assert.throws(() => convert('', { base: 'EUR', rates }), {
			message:
				'Could not parse the expression. Make sure it includes at least a valid amount.',
		});
	});

	it('throws on NaN amount', () => {
		assert.throws(
			() => convert(Number.NaN, { from: 'USD', to: 'GBP', base: 'EUR', rates }),
			{ message: 'The `amount` must be a finite number.' },
		);
	});

	it('throws on Infinity amount', () => {
		assert.throws(
			() =>
				convert(Number.POSITIVE_INFINITY, {
					from: 'USD',
					to: 'GBP',
					base: 'EUR',
					rates,
				}),
			{ message: 'The `amount` must be a finite number.' },
		);
	});
});

describe('big.js integration', () => {
	it('avoids floating point issues with Big.js', () => {
		const precisionRates = { USD: 1, EUR: 0.8235 };
		assert.strictEqual(
			convert(1, {
				from: 'USD',
				to: 'EUR',
				base: 'USD',
				rates: precisionRates,
				BigJs: Big,
			}),
			0.8235,
		);
	});
});
