import React from 'react';
import GameService from '../services/gameService';

const getStyle = ({ state: { health }}) => ({
	backgroundColor: GameService.healthColor(health),
	width: `${ health }%`,
	height: '100%',
});

const HealthBar = (context) => {
	const { state: { health }} = context;

	return <div role="healthBar" className="health-bar">
		<div style={ getStyle(context) }>
			{GameService.ceilHealth(health)}
		</div>
	</div>;
};

export default HealthBar;
