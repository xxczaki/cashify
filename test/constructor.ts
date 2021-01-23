import test from 'ava';
import {Cashify} from '../src';

const rates = {
	GBP: 0.92,
	EUR: 1,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

test('basic conversion', t => {
	t.is(cashify.convert(12, {from: 'USD', to: 'GBP'}), 9.857142857142856);
});

test('`from` equals `base`', t => {
	t.is(cashify.convert(10, {from: 'EUR', to: 'GBP'}), 9.2);
});

test('`to` equals `base`', t => {
	t.is(cashify.convert(10, {from: 'GBP', to: 'EUR'}), 10.869565217391303);
});

test('`from` equals `to`', t => {
	t.is(cashify.convert(10, {from: 'USD', to: 'USD'}), 10);
});

test('`from` equals `to`, but `base` is different', t => {
	const cashify = new Cashify({base: 'USD', rates});

	t.is(cashify.convert(10, {from: 'EUR', to: 'EUR'}), 10);
});

test('accept `amount` of type `string`', t => {
	t.is(cashify.convert('12', {from: 'USD', to: 'GBP'}), 9.857142857142856);
});

test('edge case: accept `amount` of type `string`, equal to 0', t => {
	t.is(cashify.convert('0', {from: 'USD', to: 'GBP'}), 0);
});

test('`amount` equals 0', t => {
	t.is(cashify.convert(0, {from: 'USD', to: 'GBP'}), 0);
});

test('basic parsing (integer)', t => {
	t.is(cashify.convert('$12 USD', {to: 'GBP'}), 9.857142857142856);
});

test('basic parsing (float)', t => {
	t.is(cashify.convert('1.23 GBP', {to: 'EUR'}), 1.3369565217391304);
});

test('full parsing (integer)', t => {
	t.is(cashify.convert('$12 USD TO GBP'), 9.857142857142856);
	t.is(cashify.convert('$12 USD IN GBP'), 9.857142857142856);
	t.is(cashify.convert('$12 USD AS GBP'), 9.857142857142856);
});

test('full parsing (float)', t => {
	t.is(cashify.convert('1.23 gbp to eur'), 1.3369565217391304);
	t.is(cashify.convert('1.23 gbp in eur'), 1.3369565217391304);
	t.is(cashify.convert('1.23 gbp as eur'), 1.3369565217391304);
});

test('`from` is not defined', t => {
	const error = t.throws(() => {
		cashify.convert(10, {to: 'EUR'});
	}, {instanceOf: Error});

	t.is(error.message, 'Please specify the `from` and/or `to` currency or use parsing!');
});

test('`rates` without `base` currency', t => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	const cashify = new Cashify({base: 'EUR', rates});

	t.is(cashify.convert(10, {from: 'EUR', to: 'GBP'}), 9.2);
});

test('`rates` object does not contain either `from` or `to` currency', t => {
	const error = t.throws(() => {
		cashify.convert(10, {from: 'CHF', to: 'EUR'});
	}, {instanceOf: Error});

	t.is(error.message, '`rates` object does not contain either `from` or `to` currency!');
});

test('parsing without a correct amount', t => {
	const error = t.throws(() => {
		cashify.convert('');
	}, {instanceOf: TypeError});

	t.is(error.message, 'Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
});
