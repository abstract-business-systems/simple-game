/* eslint-disable no-shadow */
import config from '../../core/config';
import { keys } from '@laufire/utils/collection';
import { rndValue, rndBetween, rndString } from '@laufire/utils/random';
import { getVariance, isProbable, getId } from '../helperService';
import positionService from '../positionService';
import { truthy } from '@laufire/utils/predicates';
import * as HelperService from '../helperService';

const { maxTargets } = config;
const targetTypeKeys = keys(config.targets);
const sixtyFive = 65;
const threeHundredFifty = 350;

const targetManager = {

	getTargets: ({ x, y, type } = {}) => {
		const typeConfig = config.targets[type || rndValue(targetTypeKeys)];
		const variance = getVariance(typeConfig.variance);
		const size = {
			height: typeConfig.height * variance,
			width: typeConfig.width * variance,
		};

		return {
			id: getId(config),
			x: x !== undefined ? x : positionService.getRandomValue(size.width),
			y: y !== undefined ? y : 0,
			color: rndBetween(sixtyFive, threeHundredFifty),
			...typeConfig,
			...size,
		};
	},

	spawnTargets: () => targetTypeKeys.map((type) =>
		isProbable(config.targets[type].prop.spawn)
		&& targetManager.getTargets({ type })).filter(truthy),

	addTargets: ({ state: { targets }}) =>
		(targets.length < maxTargets
			? [
				...targets,
				...targetManager.spawnTargets(),
			]
			:	targets),

	makeBullet: ({ state: { targets }, config, data }) =>
		({
			...data,
			id: rndString(config.rndLength),
			x: rndValue(targets).x,
			y: config.targets.shooter.y,
			isHit: false,
		}),

	getType: ({ config: { enemyBulletsType }}) => {
		const bulletTypeKeys = keys(enemyBulletsType);

		const type = bulletTypeKeys.find((key) =>
			HelperService .isProbable(enemyBulletsType[key].prob));

		return enemyBulletsType[type] || {};
	},

	generateEnemyBullets: (context) => {
		const { state: { enemyBullets }} = context;

		return [...enemyBullets,
			targetManager.makeBullet({
				...context,
				data: targetManager.getType(context),
			})];
	},
};

export default targetManager;
