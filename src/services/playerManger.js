import PositionService from './positionService';

const hundred = 100;
const PlayerManager = {
	isAlive: ({ state }) => state.health > 0,

	decreaseHealth: ({ state, config }) =>
		({ health: state.health - config.damage }),

	backGroundMovingAxis: ({ state, config }) =>
		({ bgnScreenY:
			(state.bgnScreenY + config.bgnScreenYIncre) % hundred }),

	updateCloudPosition: ({ state, config }) => state.objects.map((obj) => ({
		...obj,
		y: obj.y + config.bgnScreenYIncre,
	})),

	resetCloudPosition: ({ state }) =>
		state.objects.filter((obj) => obj.y < hundred),

	moveBullets: ({ state, config }) =>
		state.bullets.map((bullet) => ({
			...bullet,
			y: bullet.y - config.moveBulletPercentage,
		})),

	detectBulletHit: ({ state: { targets, bullets }}) =>
		bullets.map((bullet) => ({
			...bullet,
			isHit: PositionService.isBulletHit(targets, bullet),
		})),

	removeHitBullets: ({ state: { bullets }}) =>
		bullets.filter((data) => data.isHit !== true),
};

export default PlayerManager;
