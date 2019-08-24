import test from 'ava';
import {convert} from '../dist';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

test('basic conversion', t => {
	t.is(convert(12, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857142857142858);
});

test('`from` equals `base`', t => {
	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

test('`to` equals `base`', t => {
	t.is(convert(10, {from: 'GBP', to: 'EUR', base: 'EUR', rates}), 10.869565217391305);
});

test('`from` equals `to`', t => {
	t.is(convert(10, {from: 'USD', to: 'USD', base: 'EUR', rates}), 10);
});

test('`from` equals `to`, but `base` is different', t => {
	t.is(convert(10, {from: 'EUR', to: 'EUR', base: 'USD', rates}), 10);
});

test('`rates` without `base` currency', t => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	t.is(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});
