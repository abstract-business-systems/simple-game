import React from 'react';
import PositionService from '../services/positionService';

const style = ({ state: { flight }}) => {
	const { x } = PositionService.project(flight);

	return { left: `${ x }%` };
};

const Flight = (context) =>
	<div
		role="flight"
		className="flight"
		style={ style(context) }
	/>;

export default Flight;
