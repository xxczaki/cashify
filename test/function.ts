import test from 'ava';
import {convert} from '../src';

const rates = {
	GBP: 0.92,
	EUR: 1,
	USD: 1.12
};

test('basic conversion', t => {
	t.is(convert(12, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857142857142856);
});

test('`from` equals `base`', t => {
	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

test('`to` equals `base`', t => {
	t.is(convert(10, {from: 'GBP', to: 'EUR', base: 'EUR', rates}), 10.869565217391303);
});

test('`from` equals `to`', t => {
	t.is(convert(10, {from: 'USD', to: 'USD', base: 'EUR', rates}), 10);
});

test('`from` equals `to`, but `base` is different', t => {
	t.is(convert(10, {from: 'EUR', to: 'EUR', base: 'USD', rates}), 10);
});

test('accept `amount` of type `string`', t => {
	t.is(convert('12', {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857142857142856);
});

test('edge case: accept `amount` of type `string`, equal to 0', t => {
	t.is(convert('0', {from: 'USD', to: 'GBP', base: 'EUR', rates}), 0);
});

test('`amount` equals 0', t => {
	t.is(convert(0, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 0);
});

test('basic parsing (integer)', t => {
	t.is(convert('$12 USD', {to: 'GBP', base: 'EUR', rates}), 9.857142857142856);
});

test('basic parsing (float)', t => {
	t.is(convert('1.23 GBP', {to: 'EUR', base: 'USD', rates}), 1.3369565217391304);
});

test('full parsing (integer)', t => {
	t.is(convert('$12 USD TO GBP', {base: 'EUR', rates}), 9.857142857142856);
	t.is(convert('$12 USD IN GBP', {base: 'EUR', rates}), 9.857142857142856);
	t.is(convert('$12 USD AS GBP', {base: 'EUR', rates}), 9.857142857142856);
});

test('full parsing (float)', t => {
	t.is(convert('1.23 gbp to eur', {base: 'USD', rates}), 1.3369565217391304);
	t.is(convert('1.23 gbp in eur', {base: 'USD', rates}), 1.3369565217391304);
	t.is(convert('1.23 gbp as eur', {base: 'USD', rates}), 1.3369565217391304);
});

test('`from` is not defined', t => {
	const error = t.throws(() => {
		convert(10, {to: 'EUR', base: 'USD', rates});
	}, {instanceOf: Error});

	t.is(error.message, 'Please specify the `from` and/or `to` currency or use parsing!');
});

test('`rates` without `base` currency', t => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

test('`rates` object does not contain either `from` or `to` currency', t => {
	const error = t.throws(() => {
		convert(10, {from: 'CHF', to: 'EUR', base: 'EUR', rates});
	}, {instanceOf: Error});

	t.is(error.message, '`rates` object does not contain either `from` or `to` currency!');
});

test('parsing without a correct amount', t => {
	const error = t.throws(() => {
		convert('', {base: 'EUR', rates});
	}, {instanceOf: TypeError});

	t.is(error.message, 'Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
});
