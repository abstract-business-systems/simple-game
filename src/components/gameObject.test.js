import GameObject from './gameObject';
import { render } from '@testing-library/react';
import { rndBetween } from '@laufire/utils/lib';
import { rndString } from '@laufire/utils/random';

test('test backgroundObjects', () => {
	const data = {
		height: rndBetween(),
		width: rndBetween(),
		type: rndString(),
		image: rndString(),
		id: rndString(),
	};

	const style = {
		top: `${ data.y }%`,
		left: `${ data.x }%`,
		height: `${ data.height }vw`,
		width: `${ data.width }vw`,
	};

	const component = render(GameObject()(data))
		.getByRole('object');

	expect(component).toHaveStyle(style);
	expect(component).toHaveClass(data.type);
	expect(component).toHaveAttribute('src', data.image);
	expect(component).toBeInTheDocument();
});
