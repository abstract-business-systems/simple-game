/* eslint-disable react/display-name */

import React from 'react';
import { render } from '@testing-library/react';

import App from './App';
import * as Game from './components/game';

test('App renders Game', () => {
	jest.spyOn(Game, 'default').mockReturnValue(<div role="game"/>);

	const context = Symbol('context');

	const { getByRole } = render(<App context={ context }/>);

	expect(getByRole('game')).toBeInTheDocument();
	expect(Game.default).toHaveBeenCalled();
});
