# Cashify

> Lightweight currency conversion library, successor of money.js

[![CI](https://github.com/xxczaki/cashify/actions/workflows/ci.yml/badge.svg)](https://github.com/xxczaki/cashify/actions/workflows/ci.yml)
[![install size](https://packagephobia.com/badge?p=cashify)](https://packagephobia.com/result?p=cashify)
[![Mentioned in Awesome Node.js](https://awesome.re/mentioned-badge.svg)](https://github.com/sindresorhus/awesome-nodejs)

- [Motivation](#motivation)
- [Highlights](#highlights)
- [Install](#install)
- [Usage](#usage)
	- [With constructor](#with-constructor)
	- [Without constructor](#without-constructor)
	- [Parsing](#parsing)
	- [Integration with big.js](#integration-bigjs)
	- [Formatting with Intl.NumberFormat](#formatting-with-intlnumberformat)
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
- [AI disclosure](#ai-disclosure)
- [License](#license)

---

## Motivation

This package was created, because the popular [money.js](http://openexchangerates.github.io/money.js/) library:
* is not maintained (last commit was over 10 years ago)
* has over 20 open issues
* does not support TypeScript
* has implicit globals
* does not have any unit tests
* [has floating point issues](#floating-point-issues)

## Highlights

- Simple API
- 0 runtime dependencies
- Well tested and documented
- [Easy migration from money.js](#migrating-from-moneyjs)
- Written in TypeScript
- ESM-only

## Install

```
$ pnpm add cashify
```

**This package is ESM-only and requires Node.js 24 or higher.**

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

[big.js](https://github.com/MikeMcl/big.js/) is a small JavaScript library for arbitrary-precision decimal arithmetic. You can use it with cashify to make sure you won't run into floating point issues:

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

console.log(result); //=> 0.8235 (without big.js you would get something like 0.8234999999999999)
```

### Formatting with [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

You can use the built-in `Intl.NumberFormat` API to format conversion results as currency strings:

```js
import {Cashify} from 'cashify';

const rates = {
	GBP: 0.92,
	EUR: 1.00,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

const converted = cashify.convert(8635619, {from: 'EUR', to: 'GBP'}); // => 7944769.48

// Format the conversion result
new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(converted); // => '£7,944,769.48'
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
import {Cashify} from 'cashify';

const rates = {
	GBP: 0.92,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

// money.js would give: 9.200000000000001
cashify.convert(10, {from: 'EUR', to: 'GBP'}); //=> 9.2
```

Cashify uses a simple rounding trick (`amount * 100 * rate / 100`) that avoids floating point errors in many common currency conversions. **This works well for most practical currency values**, but it is not a complete solution for all possible floating point edge cases. For guaranteed arbitrary-precision arithmetic, use the [big.js integration](#integration-bigjs).

## Related projects

* [nestjs-cashify](https://github.com/vahidvdn/nestjs-cashify) – Node.js Cashify module for Nest.js.
* [cashify-rs](https://github.com/xxczaki/cashify-rs) – Cashify port for Rust.

## AI disclosure

This project contains code generated by Large Language Models (LLMs), under human supervision and proofreading.

## License

MIT © [Antoni Kępiński](https://xxczaki.com)
