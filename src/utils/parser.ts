const SEPARATOR_PATTERN = /to|in|as/i;

interface ParseResult {
	amount: number;
	from: string | undefined;
	to: string | undefined;
}

export default function parse(expression: string): ParseResult {
	const amount = Number(expression.replace(/[^\d-.]/g, ''));
	let from: string | undefined;
	let to: string | undefined;

	if (SEPARATOR_PATTERN.test(expression)) {
		const separatorIndex = expression.search(SEPARATOR_PATTERN);
		const firstPart = expression.slice(0, separatorIndex).toUpperCase().trim();

		from = firstPart.replace(/[^A-Za-z]/g, '');
		to = expression
			.slice(separatorIndex + 2)
			.toUpperCase()
			.trim();
	} else {
		from = expression.replace(/[^A-Za-z]/g, '');
	}

	if (Number.isNaN(amount) || expression.trim().length === 0) {
		throw new TypeError(
			'Could not parse the expression. Make sure it includes at least a valid amount.',
		);
	}

	return {
		amount,
		from: from.toUpperCase() || undefined,
		to,
	};
}
