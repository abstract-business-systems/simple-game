import { keys } from '@laufire/utils/collection';
import { rndString } from '@laufire/utils/random';
import * as HelperService from '../helperService';

const bulletManager = {
	makeBullet: ({ state: { flight: { x }}, config, data }) =>
		({ ...data,
			id: rndString(config.rndLength),
			x: x,
			y: config.bulletYAxis,
			isHit: false }),

	getType: ({ config: { bulletsType, defaultBulletType }}) => {
		const bulletTypeKeys = keys(bulletsType);

		const type = bulletTypeKeys.find((key) =>
			HelperService.isProbable(bulletsType[key].prob));

		return type !== undefined
			? bulletsType[type]
			: bulletsType[defaultBulletType];
	},

	generateBullets: (context) => {
		const { state: { bullets }} = context;

		return bullets.concat(bulletManager
			.makeBullet({ ...context,
				data: bulletManager.getType(context) }));
	},
};

export default bulletManager;
