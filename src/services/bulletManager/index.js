/* eslint-disable no-magic-numbers */
import { keys, map, range } from '@laufire/utils/collection';
import { rndString, rndValue } from '@laufire/utils/random';
import * as HelperService from '../helperService';
import PositionService from '../positionService';

const bulletManager = {

	positions: {
		enemy: ({ state: { targets }, config }) => ({
			x: rndValue(targets).x,
			y: config.targets.shooter.y,
		}),

		player: ({ config, data }) => ({
			x: data,
			y: config.bulletYAxis,
		}),
	},

	makeBullet: (context) => {
		const { data, config: { rndLength }} = context;

		return {
			...data,
			id: rndString(rndLength),
			isHit: false,
			...bulletManager.positions[data.team]({ ...context,
				data: data.bulletXAxis }),
		};
	},

	getType: ({ config: { bulletsType, defaultBulletType }}) => {
		const bulletTypeKeys = keys(bulletsType);
		const type = bulletTypeKeys.find((key) =>
			HelperService.isProbable(bulletsType[key].prob));

		return bulletsType[type] || bulletsType[defaultBulletType];
	},

	isFuture: (dateValue) => dateValue > Date.now(),

	isActive: (context, power) => {
		const { state } = context;

		return bulletManager.isFuture(state.durations[power]);
	},

	generateDoubleBullets: (context) => {
		const { state: { bullets },
			config: { bulletsCount }, data } = context;

		return [...bullets,
			...map(range(0, bulletsCount), () => bulletManager.makeBullet({
				...context,
				data: {
					...bulletManager.getType(context),
					team: data,
					bulletXAxis: PositionService.getBulletPosition(context),
				},
			}))];
	},

	generateBullets: (context) => {
		const { state: { bullets, flight: { x }}, data, config } = context;
		const hasShootingProbability = HelperService
			.isProbable(config.shootingProbMultiplier);

		return data || hasShootingProbability
			? [...bullets,
				bulletManager.makeBullet({
					...context,
					data: {
						...bulletManager.getType(context),
						team: data || 'enemy',
						bulletXAxis: x,
					},
				})]
			: bullets;
	},
};

export default bulletManager;
