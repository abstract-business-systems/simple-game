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
		getType, makeBullet, positions,
		checkShootingProbability } = bulletManager;

	describe('makeBullets', () => {
		const id = Symbol('id');
		const getPositions = {
			[random.rndString()]: Symbol(random.rndString()),
		};
		const getData = { data: Symbol('data') };
		const config = {
			rndLength: Symbol('rndLength'),
		};

		test('get enemy positions', () => {
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

		test('get player positions', () => {
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

	describe('generateBullets renders bullets[{}]', () => {
		const bullet = Symbol('bullet');
		const bullets = range(0, rndBetween(five, ten)).map(Symbol);
		const typeConfig = {
			[random.rndString()]: Symbol(random.rndString()),
		};
		const state = { bullets: [bullets] };

		test('team player', () => {
			const team = 'player';
			const context = { state: state, data: team };
			const data = {
				...context,
				data: { ... typeConfig, team },
			};

			jest.spyOn(bulletManager, 'makeBullet').mockReturnValue(bullet);
			jest.spyOn(bulletManager, 'getType').mockReturnValue(typeConfig);
			jest.spyOn(bulletManager, 'checkShootingProbability')
				.mockReturnValue(false);

			const result = generateBullets(context);
			const expected = [bullets, bullet];

			expect(bulletManager.getType).toHaveBeenCalledWith(context);
			expect(bulletManager.checkShootingProbability)
				.toHaveBeenCalledWith(context);
			expect(result).toEqual(expected);
			expect(bulletManager.makeBullet).toHaveBeenCalledWith(data);
		});

		test('team enemy', () => {
			const team = 'enemy';
			const context = { state: state, data: '' };
			const data = { ...context, data: { ... typeConfig, team }};

			jest.spyOn(bulletManager, 'makeBullet').mockReturnValue(bullet);
			jest.spyOn(bulletManager, 'getType').mockReturnValue(typeConfig);
			jest.spyOn(bulletManager, 'checkShootingProbability')
				.mockReturnValue(true);

			const result = generateBullets(context);
			const expected = [bullets, bullet];

			expect(bulletManager.getType).toHaveBeenCalledWith(context);
			expect(bulletManager.checkShootingProbability)
				.toHaveBeenCalledWith(context);
			expect(bulletManager.makeBullet).toHaveBeenCalledWith(data);
			expect(result).toEqual(expected);
		});

		test('No shooting probability', () => {
			const context = { state: state, data: '' };

			jest.spyOn(bulletManager, 'makeBullet').mockReturnValue(bullet);
			jest.spyOn(bulletManager, 'getType').mockReturnValue(typeConfig);
			jest.spyOn(bulletManager, 'checkShootingProbability')
				.mockReturnValue(false);

			const result = generateBullets(context);
			const expected = [bullets];

			expect(bulletManager.getType).toHaveBeenCalledWith(context);
			expect(bulletManager.checkShootingProbability)
				.toHaveBeenCalledWith(context);
			expect(bulletManager.makeBullet).not.toHaveBeenCalled();
			expect(result).toEqual(expected);
		});
	});

	test('check shooting probability', () => {
		const config = {
			shootingProbMultiplier: Symbol('shootingProbMultiplier'),
		};
		const isProbable = rndValue([true, false]);

		jest.spyOn(HelperService, 'isProbable').mockReturnValue(isProbable);

		const result = checkShootingProbability({ config });
		const expected = isProbable;

		expect(result).toEqual(expected);
		expect(HelperService.isProbable)
			.toHaveBeenCalledWith(config.shootingProbMultiplier);
	});

	test('enemy positions', () => {
		const targets = range(0, five).map(Symbol);
		const state = { targets: [targets] };
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
