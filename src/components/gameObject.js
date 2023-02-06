/* eslint-disable react/display-name*/
import React from 'react';

const GameObject = () => (data) => {
	const { id, height, width, type, image, x, y } = data;

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
