import { render } from '@testing-library/react';
import Bullet from './bullet';
import bulletImg from '../images/bullet.png';
import { rndValue } from '@laufire/utils/random';

describe('test bullets', () => {
	test('bullet is rendered when type normal', () => {
		const bullet = { id: 'id',
			type: 'normal',
			x: 100,
			y: 100,
			height: 2,
			width: 1,
			image: bulletImg,
			team: rndValue(['player', 'enemy']),
			hue: 0 };
		const style = {
			height: `${ bullet.height }vw`,
			width: `${ bullet.width }vw`,
			left: `${ bullet.x }%`,
			top: `${ bullet.y }%`,
			filter: `hue-rotate(${ bullet.color }deg)`,
		};

		const component = render(Bullet(bullet)).getByRole(bullet.team);

		expect(component).toBeInTheDocument();
		expect(component).toHaveClass(bullet.team);
		expect(component).toHaveStyle(style);
		expect(component).toHaveAttribute('src', bulletImg);
	});
});
