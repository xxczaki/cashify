import test from 'ava';
import {Cashify, convert} from './dist';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

test('basic conversion', t => {
	t.is(cashify.convert(12, {from: 'USD', to: 'GBP'}), 9.857142857142858);
});

test('`from` equals `base`', t => {
	t.is(cashify.convert(10, {from: 'EUR', to: 'GBP'}), 9.200000000000001);
});

test('`to` equals `base`', t => {
	t.is(cashify.convert(10, {from: 'GBP', to: 'EUR'}), 10.869565217391305);
});

test('`from` equals `to`', t => {
	t.is(cashify.convert(10, {from: 'EUR', to: 'EUR'}), 10);
});

test('`from` equals `to`, but `base` is different', t => {
	const cashify = new Cashify({base: 'USD', rates});

	t.is(cashify.convert(10, {from: 'EUR', to: 'EUR'}), 10);
});

test('`rates` without `base` currency', t => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	const cashify = new Cashify({base: 'EUR', rates});

	t.is(cashify.convert(10, {from: 'EUR', to: 'GBP'}), 9.200000000000001);
});

test('basic conversion (without constructor)', t => {
	t.is(convert(12, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857142857142858);
});

test('`from` equals `base` (without constructor)', t => {
	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.200000000000001);
});

test('`to` equals `base` (without constructor)', t => {
	t.is(convert(10, {from: 'GBP', to: 'EUR', base: 'EUR', rates}), 10.869565217391305);
});

test('`from` equals `to` (without constructor)', t => {
	t.is(convert(10, {from: 'EUR', to: 'EUR', base: 'EUR', rates}), 10);
});

test('`from` equals `to`, but `base` is different (without constructor)', t => {
	t.is(convert(10, {from: 'EUR', to: 'EUR', base: 'USD', rates}), 10);
});

test('`rates` without `base` currency (without constructor)', t => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.200000000000001);
});
