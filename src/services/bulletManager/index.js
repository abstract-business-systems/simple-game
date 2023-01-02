import { keys } from '@laufire/utils/collection';
import { rndString, rndValue } from '@laufire/utils/random';
import * as HelperService from '../helperService';

const makeBullet = {
	enemy: ({ state: { targets }, config }) => ({
		x: rndValue(targets).x,
		y: config.targets.shooter.y,
	}),

	player: ({ state: { flight: { x }}, config }) => ({
		x: x,
		y: config.bulletYAxis,
	}),
};

const bulletManager = {
	makeBullet: (context) => {
		const { data, config: { rndLength }} = context;

		return {
			...data,
			...{
				id: rndString(rndLength),
				isHit: false,
			},
			...makeBullet[data.team](context),
		};
	},

	getType: ({ config: { bulletsType, defaultBulletType }, data }) => {
		const bulletTypeKeys = keys(bulletsType);
		const type = bulletTypeKeys.find((key) =>
			HelperService.isProbable(bulletsType[key].prob));
		const typeConfigs = {
			player: bulletsType[type] || bulletsType[defaultBulletType],
			enemy: bulletsType[type],
		};

		return typeConfigs[data];
	},

	generateBullets: (context) => {
		const { state: { bullets }, data } = context;
		const team = data || 'enemy';
		const typeConfig = bulletManager.getType({ ...context, data: team });

		return typeConfig
			? [...bullets,
				bulletManager.makeBullet({
					...context,
					data: { ...typeConfig, team },
				})]
			: [...bullets];
	},
};

export default bulletManager;
