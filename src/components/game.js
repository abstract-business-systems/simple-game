import React from 'react';
import GameOverScreen from './gameOverScreen';
import PlayerManager from '../services/playerManager';
import GameScreen from './gameScreen';
import WelcomeScreen from './welcomeScreen';
import Keyboard from './keyboard';

const Game = (context) => {
	const { state } = context;
	const ReadyScreens = {
		true: PlayerManager.isAlive(context)
			? GameScreen
			: GameOverScreen,
		false: WelcomeScreen,
	};
	const ReadyScreen = ReadyScreens[state.ready];

	return (
		<div className="game" role="game">
			<ReadyScreen { ...context }/>
			{Keyboard(context) }
		</div>
	);
};

export default Game;
