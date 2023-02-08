import { render } from '@testing-library/react';
import Target from './target';
import targetManager from '../services/targetManager/index';

describe('Target', () => {
	test('renders the component with appropriate styling', () => {
		const target = targetManager.getTargets();
		const { width, height, color, x, y } = target;

		const { getByRole } = render(Target(target));

		const component = getByRole('targets');

		expect(component).toBeInTheDocument();
		expect(component).toHaveStyle({
			top: `${ y }%`,
			left: `${ x }%`,
			height: `${ height }vw`,
			width: `${ width }vw`,
			filter: `hue-rotate(${ color }deg)`,
		});
	});
});
