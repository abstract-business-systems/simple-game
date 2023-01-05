import { range } from '@laufire/utils/collection';
import { rndBetween } from '@laufire/utils/lib';
import bulletManager from '.';
import * as HelperService from '../helperService';
import { collection, random } from '@laufire/utils';

describe('testing bulletManager', () => {
	const two = 2;
	const five = 5;
	const ten = 10;

	const { generateBullets,
		getType, makeBullet } = bulletManager;

	describe('makeBullets', () => {
		const id = Symbol('id');
		const getPositions = {
			[random.rndString()]: Symbol(random.rndString()),
		};
		const getData = { data: Symbol('data') };
		const config = {
			rndLength: Symbol('rndLength'),
		};

		test('Get enemy positions', () => {
			const team = 'enemy';
			const data = { ...getData, team };
			const context = {
				config,
				data,
			};

			jest.spyOn(random, 'rndString').mockReturnValue(id);

			jest.spyOn(bulletManager.positions, team)
				.mockReturnValue(getPositions);

			const result = makeBullet(context);

			const expected = {
				...data,
				id: id,
				isHit: false,
				...getPositions,
			};

			expect(result).toMatchObject(expected);
			expect(random.rndString)
				.toHaveBeenCalledWith(context.config.rndLength);
			expect(bulletManager.positions[team])
				.toHaveBeenCalledWith(context);
		});

		test('Get player positions', () => {
			const team = 'player';
			const data = { ...getData, team };
			const context = {
				config,
				data,
			};

			jest.spyOn(random, 'rndString').mockReturnValue(id);

			jest.spyOn(bulletManager.positions, team)
				.mockReturnValue(getPositions);

			const result = makeBullet(context);

			const expected = {
				...data,
				id: id,
				isHit: false,
				...getPositions,
			};

			expect(result).toMatchObject(expected);
			expect(random.rndString)
				.toHaveBeenCalledWith(context.config.rndLength);
			expect(bulletManager.positions[team])
				.toHaveBeenCalledWith(context);
		});
	});

	describe('getType', () => {
		const context = {
			config: {
				bulletsType: {
					normal: { prob: Symbol('normalProb') },
					superBullet: { prob: Symbol('superProb') },
				},
				defaultBulletType: 'normal',
			},
		};

		test('returns normal from bulletsTypeKeys when true', () => {
			jest.spyOn(collection, 'keys');
			jest.spyOn(HelperService, 'isProbable')
				.mockReturnValueOnce(false)
				.mockReturnValue(true);
			const expected = context.config.bulletsType.superBullet;

			const result = getType(context);

			expect(result).toEqual(expected);
			expect(collection.keys)
				.toHaveBeenCalledWith(context.config.bulletsType);
			expect(HelperService.isProbable)
				.toHaveBeenNthCalledWith(1, context
					.config.bulletsType.normal.prob);
			expect(HelperService.isProbable)
				.toHaveBeenNthCalledWith(two, context
					.config.bulletsType.superBullet.prob);
		});

		test('returns normal from config.defaultBulletType when undefined'
			, () => {
				jest.spyOn(collection, 'keys');
				jest.spyOn(HelperService, 'isProbable')
					.mockReturnValue(false);
				const expected = context.config.bulletsType.normal;

				const result = getType(context);

				expect(result).toEqual(expected);
				expect(collection.keys)
					.toHaveBeenCalledWith(context.config.bulletsType);
				expect(HelperService.isProbable)
					.toHaveBeenNthCalledWith(1, context
						.config.bulletsType.normal.prob);
				expect(HelperService.isProbable)
					.toHaveBeenNthCalledWith(two, context
						.config.bulletsType.superBullet.prob);
			});
	});

	test('generateBullets renders bullets[{}]', () => {
		const bullet = Symbol('bullet');
		const bullets = range(0, rndBetween(five, ten)).map(Symbol);
		const team = Symbol('team');
		const typeConfig = Symbol('typeConfig');

		jest.spyOn(bulletManager, 'makeBullet').mockReturnValue(bullet);
		jest.spyOn(bulletManager, 'getType').mockReturnValue(typeConfig);
		const context = { state: { bullets: [bullets] }, config: {}};
		const data = { ...context, data: { ...{ typeConfig, team }}};
		const expected = [bullets, bullet];

		const result = generateBullets(context);

		expect(bulletManager.getType).toHaveBeenCalledWith(context);
		expect(bulletManager.makeBullet).toHaveBeenCalledWith(data);
		expect(result).toEqual(expected);
	});
});
