import React from 'react';
import Bullet from '../bullet';
import Container from '../container';
import Flight from '../flight';
import HealthBar from '../healthBar';
import Score from '../score';
import Target from '../target';
import BGObject from '../object';
import Power from '../power';

const TwoDMode = (context) => {
	const { state } = context;

	return (
		<div role="twoDMode" className="twoDMode">
			{ HealthBar() }
			{ Container(state.objects, BGObject) }
			{ Container(state.powers, Power) }
			{ Score() }
			{ Container(state.bullets, Bullet) }
			{ Flight() }
			{ Container(state.targets, Target) }
		</div>
	);
};

export default TwoDMode;
