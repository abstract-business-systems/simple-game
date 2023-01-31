/* eslint-disable no-magic-numbers */
import { keys, map, range } from '@laufire/utils/collection';
import { rndString, rndValues } from '@laufire/utils/random';
import * as HelperService from '../helperService';
import PositionService from '../positionService';

const bulletManager = {

	positions: {
		enemy: ({ data: target, config }) => ({
			x: target.x,
			y: config.targets.shooter.y,
		}),

		player: ({ config, data }) => ({
			x: data,
			y: config.bulletYAxis,
		}),
	},

	getType: ({ config: { bulletsType, defaultBulletType }}) => {
		const bulletTypeKeys = keys(bulletsType);
		const type = bulletTypeKeys.find((key) =>
			HelperService.isProbable(bulletsType[key].prob));

		return bulletsType[type] || bulletsType[defaultBulletType];
	},

	makeBullet: (context) => {
		const { data: { team }, config: { rndLength }} = context;

		return {
			id: rndString(rndLength),
			isHit: false,
			...team,
			...bulletManager.positions[team](context),
			...bulletManager.getType(context),
		};
	},

	makeBullets: {
		enemy: (context) => {
			const { state: { targets }, config: { shootingProb }} = context;
			const randomTargets = rndValues(targets);
			const canShoot = HelperService.isProbable(shootingProb);

			return canShoot
				? map(randomTargets, (target) =>
					bulletManager.makeBullet({
						...context,
						...{ ...context.data, target },
					}))
				: [];
		},

		player: () => {},
	},

	isFuture: (dateValue) => dateValue > Date.now(),

	isActive: (context) => {
		const { state, data: power } = context;

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
		const { data: { team }, state: { bullets }} = context;

		return [...bullets, bulletManager.makeBullets[team](context)];
	},
};

export default bulletManager;
