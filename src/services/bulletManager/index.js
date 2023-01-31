/* eslint-disable no-magic-numbers */
import { keys, map, range } from '@laufire/utils/collection';
import { peek } from '@laufire/utils/debug';
import { rndBetween } from '@laufire/utils/lib';
import { rndString, rndValues } from '@laufire/utils/random';
import * as HelperService from '../helperService';
import PositionService from '../positionService';

const bulletManager = {

	positions: {
		enemy: ({ data: { target: { x }}, config }) => ({
			x: x,
			y: config.targets.shooter.y,
		}),

		player: ({ config, data: { x }}) => ({
			x: x,
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

		peek(context.data);

		return {
			id: rndString(rndLength),
			isHit: false,
			team: team,
			...bulletManager.positions[team](context),
			...bulletManager.getType(context),
		};
	},

	makeBullets: {
		enemy: (context) => {
			const {
				state: { targets },
				config: { shootingProb, maxTargets },
				data,
			} = context;
			const randomTargets = rndValues(targets, rndBetween(0, maxTargets));
			const canShoot = HelperService.isProbable(shootingProb);

			return canShoot
				? map(randomTargets, (target) =>
					bulletManager.makeBullet({
						...context,
						data: { ...data, target },
					}))
				: [];
		},

		player: (context) => {
			const {
				config: { bulletCount: { defaultCount, double }},
				state: { flight: { x }}, data,
			} = context;
			const isPowerActive = bulletManager.isActive({
				...context,
				data: 'doubleBullet',
			});
			const bulletCount = isPowerActive ? double : defaultCount;

			return map(range(0, bulletCount), () => {
				const xPosition = isPowerActive
					? PositionService.getBulletPosition(context)
					: x;

				return bulletManager.makeBullet({
					...context, data: { ...data, x: xPosition }
					,
				});
			});
		},
	},

	isFuture: (dateValue) => dateValue > Date.now(),

	isActive: (context) => {
		const { state, data: power } = context;

		return bulletManager.isFuture(state.durations[power]);
	},

	generateBullets: (context) => {
		const { data: { team }, state: { bullets }} = context;

		return [...bullets, ...bulletManager.makeBullets[team](context)];
	},
};

export default bulletManager;
