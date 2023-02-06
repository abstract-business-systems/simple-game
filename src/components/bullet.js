import React from 'react';

const style = (bullet) => {
	const { width, height, color, x, y } = bullet;

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
