import test from 'ava';
import Big from 'big.js';
import {Cashify, convert, parse} from './src/index.js';

const rates = {
	GBP: 0.92,
	EUR: 1,
	USD: 1.12,
};

test('exports a constructor', t => {
	const cashify = new Cashify({base: 'EUR', rates});

	t.is(cashify.convert(12, {from: 'USD', to: 'GBP'}), 9.857_142_857_142_856);
});

test('exports a `parse` function', t => {
	t.deepEqual(parse('10 eur to pln'), {
		amount: 10,
		from: 'EUR',
		to: 'PLN',
	});
});

test('basic conversion', t => {
	t.is(convert(12, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857_142_857_142_856);
});

test('`from` equals `base`', t => {
	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

test('`to` equals `base`', t => {
	t.is(convert(10, {from: 'GBP', to: 'EUR', base: 'EUR', rates}), 10.869_565_217_391_303);
});

test('`from` equals `to`', t => {
	t.is(convert(10, {from: 'USD', to: 'USD', base: 'EUR', rates}), 10);
});

test('`from` equals `to`, but `base` is different', t => {
	t.is(convert(10, {from: 'EUR', to: 'EUR', base: 'USD', rates}), 10);
});

test('accepts `amount` of type `string`', t => {
	t.is(convert('12', {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857_142_857_142_856);
});

test('edge case: accepts `amount` of type `string`, equal to 0', t => {
	t.is(convert('0', {from: 'USD', to: 'GBP', base: 'EUR', rates}), 0);
});

test('`amount` equals 0', t => {
	t.is(convert(0, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 0);
});

test('basic parsing (integer)', t => {
	t.is(convert('$12 USD', {to: 'GBP', base: 'EUR', rates}), 9.857_142_857_142_856);
});

test('basic parsing (float)', t => {
	t.is(convert('1.23 GBP', {to: 'EUR', base: 'USD', rates}), 1.336_956_521_739_130_4);
});

test('parsing without the `from` currency (integer)', t => {
	t.is(convert('12 to GBP', {from: 'USD', base: 'EUR', rates}), 9.857_142_857_142_856);
});

test('full parsing (integer)', t => {
	t.is(convert('$12 USD TO GBP', {base: 'EUR', rates}), 9.857_142_857_142_856);
	t.is(convert('$12 USD IN GBP', {base: 'EUR', rates}), 9.857_142_857_142_856);
	t.is(convert('$12 USD AS GBP', {base: 'EUR', rates}), 9.857_142_857_142_856);
});

test('full parsing (float)', t => {
	t.is(convert('1.23 gbp to eur', {base: 'USD', rates}), 1.336_956_521_739_130_4);
	t.is(convert('1.23 gbp in eur', {base: 'USD', rates}), 1.336_956_521_739_130_4);
	t.is(convert('1.23 gbp as eur', {base: 'USD', rates}), 1.336_956_521_739_130_4);
});

test('`from` is not defined', t => {
	const error = t.throws(() => {
		convert(10, {to: 'EUR', base: 'USD', rates});
	}, {instanceOf: Error});

	t.is(error.message, 'Please specify the `from` and/or `to` currency, or use parsing.');
});

test('`rates` without the `base` currency', t => {
	const rates = {
		GBP: 0.92,
		USD: 1.12,
	};

	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

test('`rates` without either the `from` or `to` currency', t => {
	const error = t.throws(() => {
		convert(10, {from: 'CHF', to: 'EUR', base: 'EUR', rates});
	}, {instanceOf: Error});

	t.is(error.message, 'The `rates` object does not contain either the `from` or `to` currency.');
});

test('parsing without a correct amount', t => {
	const error = t.throws(() => {
		convert('', {base: 'EUR', rates});
	}, {instanceOf: Error});

	t.is(error.message, 'Could not parse the expression. Make sure it includes at least a valid amount.');
});

test('avoiding floating point issues with Big.js', t => {
	const rates = {
		USD: 1,
		EUR: 0.8235,
	};

	t.is(convert(1, {from: 'USD', to: 'EUR', base: 'USD', rates, BigJs: Big}), 0.8235);
});
