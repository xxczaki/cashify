import test from 'ava';
import Cashify from './dist';

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

test('rates do not contain `from`', t => {
	const error = t.throws(() => {
		cashify.convert(10, {from: 'PLN', to: 'EUR'});
	}, Error);

	t.is(error.message, 'Rates do not contain either `from` or `to` currency!');
});
