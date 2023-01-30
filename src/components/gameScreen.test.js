/* eslint-disable react/display-name */
jest.mock('./3dMode/3dMode', () => () => <div role="3d"/>);
jest.mock('./2dMode/2dMode', () => () => <div role="2d"/>);

import React from 'react';
import { rndString, rndValue } from '@laufire/utils/random';
import { render, fireEvent } from '@testing-library/react';
import * as getMode from '../services/urlService';
import GameScreen from './gameScreen';
import bulletManager from '../services/bulletManager';
import Ticker from '../services/ticker';

describe('testing GameScreen', () => {
	const context = {
		state: {
			bgnScreenY: rndString(),
			durations: {
				doubleBullet: rndString(),
			},
		},
		actions: {
			updateMousePosition: jest.fn(),
			updateFlightPosition: jest.fn(),
			generateDoubleBullets: jest.fn(),
			generateBullets: jest.fn(),
		},
	};
	const { actions } = context;
	const GameMode = ['3d', '2d'];
	const rndMode = rndValue(GameMode);

	test('gameScreen visible', () => {
		jest.spyOn(getMode, 'default').mockReturnValue(rndMode);
		jest.spyOn(React, 'useEffect');
		jest.spyOn(Ticker, 'start').mockReturnValue();
		const component = render(<GameScreen { ...context }/>)
			.getByRole('gameScreen');

		expect(component).toBeInTheDocument();
		expect(React.useEffect).toHaveBeenCalledWith(Ticker.start, []);
		expect(component).toHaveClass('game-screen');
		expect(component).toHaveStyle({
			backgroundPositionY: `${ context.state.bgnScreenY }%`,
		});
	});

	const expectations = [
		[true, 'generateDoubleBullets'],
		[false, 'generateBullets'],
	];

	test.each(expectations)('event check', (boolean, expected) => {
		jest.spyOn(actions, 'updateMousePosition');
		jest.spyOn(actions, 'updateFlightPosition');
		jest.spyOn(actions, 'generateDoubleBullets');
		jest.spyOn(actions, 'generateBullets');
		jest.spyOn(bulletManager, 'isActive').mockReturnValue(boolean);
		jest.spyOn(getMode, 'default').mockReturnValue(rndMode);

		const component = render(GameScreen(context)).getByRole('gameScreen');

		const mouseEvent = { _reactName: 'onMouseMove', type: 'mousemove' };
		const clickEvent = {
			_reactName: 'onClick',
			type: 'click',
		};

		fireEvent.mouseMove(component, mouseEvent);
		fireEvent.click(component, clickEvent);

		expect(actions.updateMousePosition).toHaveBeenCalledWith(expect
			.objectContaining(mouseEvent));
		expect(actions.updateFlightPosition).toHaveBeenCalledWith();
		expect(bulletManager.isActive)
			.toHaveBeenCalledWith(context, 'doubleBullet');
		expect(actions[expected]).toHaveBeenCalledWith('player');
	});

	test('gameMode', () => {
		jest.spyOn(getMode, 'default').mockReturnValue(rndMode);

		const { getByRole } = render(GameScreen(context));

		expect(getByRole('gameScreen')).toBeInTheDocument();
		expect(getByRole(rndMode)).toBeInTheDocument();
		expect(getMode.default).toHaveBeenCalledWith(context);
	});
});
