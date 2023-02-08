import { React } from 'react';

const Target = (target) => {
	const { id, height, width, image, color, x, y } = target;
	const style = {
		left: `${ x }%`,
		top: `${ y }%`,
		height: `${ height }vw`,
		width: `${ width }vw`,
		filter: `hue-rotate(${ color }deg)`,
	};

	return (
		<img
			key={ id }
			className="target"
			role="targets"
			style={ style }
			src={ image }
		/>
	);
};

export default Target;
