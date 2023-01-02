import React from 'react';
import PositionService from '../services/positionService';

const style = (bullet) => {
	const { width, height, color } = bullet;
	const { x, y } = PositionService.project(bullet);

	return {
		height: `${ height }vw`,
		width: `${ width }vw`,
		left: `${ x }%`,
		top: `${ y }%`,
		filter: `hue-rotate(${ color }deg)`,

	};
};

const Bullet = (bullet) => {
	const { image, id, team } = bullet;

	return (
		<img
			key={ id }
			src={ image }
			role={ team }
			className={ `bullet ${ team }` }
			style={ style(bullet) }
		/>);
};

export default Bullet;
