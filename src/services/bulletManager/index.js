import { keys } from '@laufire/utils/collection';
import { rndString, rndValue } from '@laufire/utils/random';
import * as HelperService from '../helperService';

const bulletManager = {

	positions: {
		enemy: ({ state: { targets }, config }) => ({
			x: rndValue(targets).x,
			y: config.targets.shooter.y,
		}),

		player: ({ state: { flight: { x }}, config }) => ({
			x: x,
			y: config.bulletYAxis,
		}),
	},

	makeBullet: (context) => {
		const { data, config: { rndLength }} = context;

		return {
			...data,
			id: rndString(rndLength),
			isHit: false,
			...bulletManager.positions[data.team](context),
		};
	},

	getType: ({ config: { bulletsType, defaultBulletType }}) => {
		const bulletTypeKeys = keys(bulletsType);
		const type = bulletTypeKeys.find((key) =>
			HelperService.isProbable(bulletsType[key].prob));

		return bulletsType[type] || bulletsType[defaultBulletType];
	},

	generateBullets: (context) => {
		const { state: { bullets }, data, config } = context;
		const hasShootingProbability = HelperService
			.isProbable(config.shootingProbMultiplier);

		return data || hasShootingProbability
			? [...bullets,
				bulletManager.makeBullet({
					...context,
					data: {
						...bulletManager.getType(context),
						team: data || 'enemy',
					},
				})]
			: bullets;
	},
};

export default bulletManager;
