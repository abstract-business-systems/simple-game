/* eslint-disable react/display-name*/
import React from 'react';
import PositionService from '../services/positionService';

const GameObject = () => (data) => {
	const { id, height, width, type, image } = data;
	const { x, y } = PositionService.project(data);

	const style = {
		top: `${ y }%`,
		left: `${ x }%`,
		height: `${ height }vw`,
		width: `${ width }vw`,
	};

	return (
		<img
			key={ id }
			src={ image }
			role="object"
			style={ style }
			className={ type }
		/>) ;
};

export default GameObject;
