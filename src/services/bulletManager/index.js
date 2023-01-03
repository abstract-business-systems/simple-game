import { keys } from '@laufire/utils/collection';
import { rndString, rndValue } from '@laufire/utils/random';
import * as HelperService from '../helperService';

const positions = {
	enemy: ({ state: { targets }, config }) => ({
		x: rndValue(targets).x,
		y: config.targets.shooter.y,
	}),

	player: ({ state: { flight: { x }}, config }) => ({
		x: x,
		y: config.bulletYAxis,
	}),
};

const makeBullet = (context) => {
	const { data, config: { rndLength }} = context;

	return {
		...data,
		...{
			id: rndString(rndLength),
			isHit: false,
		},
		...positions[data.team](context),
	};
};

const getType = ({ config: { bulletsType, defaultBulletType }}) => {
	const bulletTypeKeys = keys(bulletsType);
	const type = bulletTypeKeys.find((key) =>
		HelperService.isProbable(bulletsType[key].prob));

	return bulletsType[type] || bulletsType[defaultBulletType];
};

const checkShootingProbability = ({ config: { shootingProbMultiplier }}) =>
	HelperService.isProbable(shootingProbMultiplier);

const bulletManager = {

	generateBullets: (context) => {
		const { state: { bullets }, data } = context;
		const team = data || 'enemy';
		const typeConfig = getType({ ...context, data: team });

		return data === 'player' || checkShootingProbability(context)
			? [...bullets,
				makeBullet({
					...context,
					data: { ...typeConfig, team },
				})]
			: [...bullets];
	},
};

export default bulletManager;