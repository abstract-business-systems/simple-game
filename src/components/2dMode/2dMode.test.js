import React from 'react';
import { render } from '@testing-library/react';
import TwoDMode from './2dMode';
import * as Container from '../container';
import Bullet from '../bullet';
import Target from '../target';
import BackgroundObject from '../object';
import * as HealthBar from '../healthBar';
import * as Score from '../score';
import * as Flight from '../flight';
import Power from '../power';
import { rndValues } from '@laufire/utils/random';

test('render twoDMode', () => {
	const state = {
		targets: Symbol('target'),
		bullets: Symbol('bullets'),
		objects: Symbol('objects'),
		powers: Symbol('powers'),
	};
	const context = { state	};
	const bulletTeam = rndValues(['player', 'enemy']);

	jest.spyOn(Container, 'default')
		.mockReturnValueOnce(<div role="objects"/>)
		.mockReturnValueOnce(<div role="powers"/>)
		.mockReturnValueOnce(<div role={ bulletTeam }/>)
		.mockReturnValueOnce(<div role="target"/>);

	jest.spyOn(HealthBar, 'default')
		.mockReturnValue(<div role="healthBar"/>);

	jest.spyOn(Score, 'default').mockReturnValue(<div role="score-card"/>);

	jest.spyOn(Flight, 'default').mockReturnValue(<div role="flight"/>);

	const { getByRole } = render(TwoDMode(context));

	expect(Container.default)
		.toHaveBeenCalledWith(state.objects, BackgroundObject);
	expect(Container.default)
		.toHaveBeenCalledWith(state.powers, Power);
	expect(Container.default).toHaveBeenCalledWith(state.bullets, Bullet);
	expect(Container.default).toHaveBeenCalledWith(state.targets, Target);
	expect(HealthBar.default).toHaveBeenCalled();
	expect(Flight.default).toHaveBeenCalled();
	expect(Score.default).toHaveBeenCalled();
	expect(getByRole('healthBar')).toBeInTheDocument();
	expect(getByRole('objects')).toBeInTheDocument();
	expect(getByRole('powers')).toBeInTheDocument();
	expect(getByRole('score-card')).toBeInTheDocument();
	expect(getByRole(bulletTeam)).toBeInTheDocument();
	expect(getByRole('flight')).toBeInTheDocument();
	expect(getByRole('target')).toBeInTheDocument();
	expect(getByRole('twoDMode')).toBeInTheDocument();
	expect(getByRole('twoDMode')).toHaveClass('twoDMode');
});
