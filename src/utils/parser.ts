interface Options {
	amount: number;
	from: string | undefined;
	to: string | undefined;
}

/**
* Expression parser
* @param expression Expression you want to parse, ex. `10 usd to pln` or `€1.23 eur`
* @return Object with parsing results
*/
export default function parse(expression: string): Options {
	const amount = Number.parseFloat(expression.replace(/[^\d-.]/g, '')) || undefined;
	let from;
	let to;

	// Search for separating keyword (case insensitive) to split the expression into 2 parts
	if (/to|in|as/i.exec(expression)) {
		const firstPart = expression.slice(0, expression.search(/to|in|as/i)).toUpperCase().trim();

		from = firstPart.replace(/[^A-Za-z]/g, '');
		to = expression.slice(expression.search(/to|in|as/i) + 2).toUpperCase().trim();
	} else {
		from = expression.replace(/[^A-Za-z]/g, '');
	}

	if (amount === undefined) {
		throw new Error('Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
	}

	return {
		amount,
		from: from.toUpperCase() || undefined,
		to
	};
}
