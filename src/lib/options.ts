export type Rates = Record<string, number>;

export interface Options {
	/**
	 * Currency from which you want to convert.
	*/
	from?: string;

	/**
	 * Currency to which you want to convert.
	*/
	to?: string;

	/**
	 * Base currency.
	*/
	base: string;

	/**
	 * Object containing currency rates (for example from an API, such as Open Exchange Rates).
	*/
	rates: Rates;
}
