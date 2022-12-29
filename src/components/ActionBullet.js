import { peek } from '@laufire/utils/debug';
import React from 'react';
import PositionService from '../services/positionService';

const style = {
	bullet: (bullet) => {
		const { width, height, color } = bullet;
		const { x, y } = PositionService.project(bullet);

		return {
			height: `${ height }vw`,
			width: `${ width }vw`,
			left: `${ x }%`,
			top: `${ y }%`,
			filter: `hue-rotate(${ color }deg)`,

		};
	},
	enemyBullet: (bullet) => {
		const { width, height, color } = bullet;
		const { x, y } = PositionService.project(bullet);

		return {
			height: `${ height }vw`,
			width: `${ width }vw`,
			left: `${ x }%`,
			top: `${ y }%`,
			filter: `hue-rotate(${ color }deg)`,

		};
	},
};

const ActionBullet = (action) => {
	const Bullets = (bullet) => {
		const { image, id } = bullet;

		peek(bullet);

		return (
			<img
				key={ id }
				src={ image }
				role={ action }
				className={ action }
				style={ style[action](bullet) }
			/>);
	};

	return Bullets;
};

export default ActionBullet;
