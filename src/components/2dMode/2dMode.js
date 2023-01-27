import React from 'react';
import Bullet from '../bullet';
import Container from '../container';
import Flight from '../flight';
import HealthBar from '../healthBar';
import Score from '../score';
import Target from '../target';
import BackgroundObject from '../object';
import Power from '../power';

const TwoDMode = (context) => {
	const { state } = context;

	return (
		<div role="twoDMode" className="twoDMode">
			<HealthBar { ...context }/>
			{Container(state.objects, BackgroundObject)}
			{ Container(state.powers, Power) }
			<Score { ...context }/>
			{ Container(state.bullets, Bullet) }
			<Flight { ...context }/>
			{ Container(state.targets, Target) }
		</div>
	);
};

export default TwoDMode;
