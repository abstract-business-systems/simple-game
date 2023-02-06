import React from 'react';
import Flight from './flight';
import { render } from '@testing-library/react';
import { rndString } from '@laufire/utils/random';

describe('testing Flight', () => {
	const state = {
		flight: {
			x: rndString(),
		},
	};
	const context = { state };

	test('flight is visible', () => {
		const component = render(<Flight { ...context }/>).getByRole('flight');

		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('flight');
		expect(component).toHaveStyle({
			left: `${ state.flight.x }%`,
		});
	});
});
