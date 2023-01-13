import { range } from '@laufire/utils/collection';
import { rndBetween } from '@laufire/utils/lib';
import bulletManager from '.';
import * as HelperService from '../helperService';
import { collection, random } from '@laufire/utils';
import { rndValue } from '@laufire/utils/random';

describe.only('testing bulletManager', () => {
	const two = 2;
	const five = 5;
	const ten = 10;

	const { generateBullets,
		getType, makeBullet, positions } = bulletManager;

	describe('makeBullets', () => {
		const id = Symbol('id');
		const getPositions = {
			[random.rndString()]: Symbol(random.rndString()),
		};
		const getData = { data: Symbol('data') };
		const config = {
			rndLength: Symbol('rndLength'),
		};

		test('get positions', () => {
			const team = random.rndValue(['enemy', 'player']);
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

	describe.only('generateBullets renders bullets[{}]', () => {
		const bullet = Symbol('bullet');
		const bullets = range(0, rndBetween(five, ten)).map(Symbol);
		const typeConfig = {
			[random.rndString()]: Symbol(random.rndString()),
		};
		const state = { bullets };
		const config = {
			shootingProbMultiplier: Symbol('shootingProbMultiplier'),
		};

		test('team player or enemy with shooting probability', () => {
			const data = rndValue(['player', '']);
			const context = { state, data, config };
			const team = data || 'enemy';

			const bulletProps = {
				...context,
				data: {
					... typeConfig,
					team,
				},
			};

			jest.spyOn(bulletManager, 'makeBullet').mockReturnValue(bullet);
			jest.spyOn(bulletManager, 'getType').mockReturnValue(typeConfig);
			jest.spyOn(HelperService, 'isProbable')
				.mockReturnValue(true);

			const result = generateBullets(context);
			const expected = [...bullets, bullet];

			expect(bulletManager.getType).toHaveBeenCalledWith(context);
			expect(result).toEqual(expected);
			expect(bulletManager.makeBullet).toHaveBeenCalledWith(bulletProps);
			expect(HelperService.isProbable)
				.toHaveBeenCalledWith(config.shootingProbMultiplier);
		});

		test('No shooting probability', () => {
			const data = '';
			const context = { state, data, config };

			jest.spyOn(HelperService, 'isProbable')
				.mockReturnValue(false);

			const result = generateBullets(context);
			const expected = bullets;

			expect(result).toEqual(expected);
			expect(HelperService.isProbable)
				.toHaveBeenCalledWith(config.shootingProbMultiplier);
		});
	});

	test('enemy positions', () => {
		const targets = range(0, five).map(Symbol);
		const state = { targets };
		const config = { targets: { shooter: { y: Symbol('y') }}};
		const randomValue = {
			x: Symbol('x'),
		};

		jest.spyOn(random, 'rndValue').mockReturnValue(randomValue);

		const result = positions.enemy({ state, config });
		const expected = {
			x: randomValue.x,
			y: config.targets.shooter.y,
		};

		expect(result).toEqual(expected);
		expect(random.rndValue).toHaveBeenCalledWith(state.targets);
	});

	test('player positions', () => {
		const state = { flight: { x: Symbol('x') }};
		const config = { bulletYAxis: Symbol('y') };

		const result = positions.player({ state, config });
		const expected = {
			x: state.flight.x,
			y: config.bulletYAxis,
		};

		expect(result).toEqual(expected);
	});
});
