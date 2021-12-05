# Cashify 💸

> Lightweight currency conversion library, successor of money.js

[![Build Status](https://github.com/xxczaki/cashify/workflows/CI/badge.svg)](https://github.com/xxczaki/cashify/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/xxczaki/cashify/badge.svg?branch=master)](https://coveralls.io/github/xxczaki/cashify?branch=master)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![install size](https://packagephobia.now.sh/badge?p=cashify)](https://packagephobia.now.sh/result?p=cashify)
![minified size](https://img.shields.io/bundlephobia/minzip/cashify)
[![Mentioned in Awesome Node.js](https://awesome.re/mentioned-badge.svg)](https://github.com/sindresorhus/awesome-nodejs)

- [Motivation](#motivation)
- [Highlights](#highlights)
- [Install](#install)
- [Usage](#usage)
	- [With constructor](#with-constructor)
	- [Without constructor](#without-constructor)
	- [Parsing](#parsing)
	- [Integration with big.js](#integration-bigjs)
	- [Integration with currency.js](#integration-currencyjs)
- [API](#api)
	- [Cashify({base, rates})](#cashifybase-rates)
		- [base](#base)
		- [rates](#rates)
		- [BigJs](#bigjs)
	- [convert(amount, {from, to, base, rates})](#convertamount-from-to-base-rates-with-and-without-constructor)
        - [amount](#amount)
        - [from](#from)
        - [to](#to)
        - [base](#base-1)
        - [rates](#rates-1)
        - [BigJs](#bigjs-1)
    - [parse(expression)](#parseexpression)
        - [expression](#expression)
- [Migrating from money.js](#migrating-from-moneyjs)
- [Floating point issues](#floating-point-issues)
- [Related projects](#related-projects)
- [License](#license)

---

## Motivation

This package was created, because the popular [money.js](http://openexchangerates.github.io/money.js/) library:
* is not maintained (last commit was ~5 years ago)
* has over 20 open issues
* does not support TypeScript
* has implicit globals
* does not have any unit tests
* [has floating point issues](#floating-point-issues)

## Highlights

- Simple API
- 0 dependencies
- Actively maintained
- Well tested and documented
- [Easy migration from money.js](#migrating-from-moneyjs)
- Written in TypeScript
- ESM-only

## Install

```
$ npm install cashify
```

**Please note that starting with version `3.0.0` this package is ESM-only and thus requires Node.js v14 or higher.**

## Usage

### With constructor

```js
import {Cashify} from 'cashify';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

const result = cashify.convert(10, {from: 'EUR', to: 'GBP'});

console.log(result); //=> 9.2
```

### Without constructor

Using the `Cashify` constructor is not required. Instead, you can just use the `convert` function:

```js
import {convert} from 'cashify';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

const result = convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates});

console.log(result); //=> 9.2
```

### Parsing

Cashify supports parsing, so you can pass a `string` to the `amount` argument and the `from` and/or `to` currency will be automatically detected:

```js
import {Cashify} from 'cashify';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

// Basic parsing
cashify.convert('€10 EUR', {to: 'GBP'});

// Full parsing
cashify.convert('10 EUR to GBP');
```

Alternatively, if you just want to parse a `string` without conversion you can use the [`parse`](#parseexpression) function which returns an `object` with parsing results:

```js
import {parse} from 'cashify';

parse('10 EUR to GBP'); //=> {amount: 10, from: 'EUR', to: 'GBP'}
```

**Note:** If you want to use full parsing, you need to pass a `string` in a specific format:

```
10 usd to pln
12.5 GBP in EUR
3.1415 eur as chf
```

You can use `to`, `in` or `as` to separate the expression (case insensitive). Used currencies name case doesn't matter, as cashify will automatically convert them to upper case.

<a id="integration-bigjs"></a>

### Integration with [big.js](https://github.com/MikeMcl/big.js/)

[big.js](https://github.com/scurker/currency.js/) is a small JavaScript library for arbitrary-precision decimal arithmetic. You can use it with cashify to make sure you won't run into floating point issues:

```js
import {Cashify} from 'cashify';
import Big from 'big.js';

const rates = {
	EUR: 0.8235,
	USD: 1
};

const cashify = new Cashify({base: 'USD', rates});

const result = cashify.convert(1, {
	from: 'USD',
	to: 'EUR',
	BigJs: Big
});

console.log(result); //=> 8.235 (without big.js you would get something like 0.8234999999999999)
```

<a id="integration-currencyjs"></a>

### Integration with [currency.js](https://github.com/scurker/currency.js/)

[currency.js](https://github.com/scurker/currency.js/) is a small and lightweight library for working with currency values. It integrates well with cashify. In the following example we are using it to format the conversion result:

```js
import {Cashify} from 'cashify';
import currency from 'currency.js';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

const converted = cashify.convert(8635619, {from: 'EUR', to: 'GBP'}); // => 7944769.48

// Format the conversion result
currency(converted, {symbol: '€', formatWithSymbol: true}).format(); // => €7,944,769.48
```

## API

### Cashify({base, rates, BigJs})

Constructor.

##### base

Type: `string`

The base currency.

##### rates

Type: `object`

An object containing currency rates (for example from an API, such as Open Exchange Rates).

##### BigJs

Type: [big.js](https://github.com/MikeMcl/big.js/) constructor

See [integration with big.js](#integration-bigjs).

### convert(amount, {from, to, base, rates}) *`with and without constructor`*

Returns conversion result (`number`).

##### amount

Type: `number` or `string`

Amount of money you want to convert. You can either use a `number` or a `string`. If you choose the second option, you can take advantage of [parsing](#parsing) and not specify `from` and/or `to` argument(s).

##### from

Type: `string`

Currency from which you want to convert. You might not need to specify it if you are using [parsing](#parsing).

##### to

Type: `string`

Currency to which you want to convert. You might not need to specify it if you are using [parsing](#parsing).

##### base

Type: `string`

The base currency.

##### rates

Type: `object`

An object containing currency rates (for example from an API, such as Open Exchange Rates).

##### BigJs

Type: [big.js](https://github.com/MikeMcl/big.js/) constructor

See [integration with big.js](#integration-bigjs).

### parse(expression)

Returns an `object`, which contains parsing results:

```
{
	amount: number;
	from: string | undefined;
	to: string | undefined;
}
```

##### expression

Type: `string`

Expression you want to parse, ex. `10 usd to pln` or `€1.23 eur`

## Migrating from money.js

With `Cashify` constructor:

```diff
- import fx from 'money';
+ import {Cashify} from 'cashify';

- fx.base = 'EUR';
- fx.rates = {
-	GBP: 0.92,
-	EUR: 1.00,
-	USD: 1.12
- };

+ const rates = {
+	 GBP: 0.92,
+	 EUR: 1.00,
+	 USD: 1.12
+ };

+ const cashify = new Cashify({base: 'EUR', rates});

- fx.convert(10, {from: 'GBP', to: 'EUR'});
+ cashify.convert(10, {from: 'GBP', to: 'EUR'});
```

With `convert` function:

```diff
- import fx from 'money';
+ import {convert} from 'cashify';

- fx.base = 'EUR';
- fx.rates = {
-	GBP: 0.92,
-	EUR: 1.00,
-	USD: 1.12
- };

+ const rates = {
+	 GBP: 0.92,
+	 EUR: 1.00,
+	 USD: 1.12
+ };

- fx.convert(10, {from: 'GBP', to: 'EUR'});
+ convert(10, {from: 'GBP', to: 'EUR', base: 'EUR', rates});
```

## Floating point issues

When working with currencies, decimals only need to be precise up to the smallest cent value while avoiding common floating point errors when performing basic arithmetic.

Let's take a look at the following example:

```js
import fx from 'money';
import {Cashify} from 'cashify';

const rates = {
	GBP: 0.92,
	USD: 1.12
};

fx.rates = rates;
fx.base = 'EUR';

const cashify = new Cashify({base: 'EUR', rates});

fx.convert(10, {from: 'EUR', to: 'GBP'}); //=> 9.200000000000001
cashify.convert(10, {from: 'EUR', to: 'GBP'}); //=> 9.2
```

As you can see, money.js doesn't handle currencies correctly and therefore a floating point issues are occuring. Even though there's just a minor discrepancy between the results, if you're converting large amounts, that can add up.

Cashify solves this problem the same way as [currency.js](https://github.com/scurker/currency.js/) - by working with integers behind the scenes. **This should be okay for most reasonable values of currencies**; if you want to avoid all floating point issues, see [integration with big.js]().

## Related projects

* [nestjs-cashify](https://github.com/vahidvdn/nestjs-cashify) - Node.js Cashify module for Nest.js.
* [cashify-rs](https://github.com/xxczaki/cashify-rs) - Cashify port for Rust.

## License

MIT © [Antoni Kępiński](https://www.kepinski.ch)
