/* eslint-disable no-magic-numbers */
import { map, range } from '@laufire/utils/collection';
import bulletManager from '.';
import * as HelperService from '../helperService';
import { collection, random } from '@laufire/utils';
import PositionService from '../positionService';

describe('testing bulletManager', () => {
	const two = 2;
	const five = 5;

	const { getType, makeBullet, positions } = bulletManager;

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

	test('enemy positions', () => {
		const data = {
			target: { x: Symbol('x') },
		};
		const config = { targets: { shooter: { y: Symbol('y') }}};

		const result = positions.enemy({ data, config });
		const expected = {
			x: data.target.x,
			y: config.targets.shooter.y,
		};

		expect(result).toEqual(expected);
	});

	test('player positions', () => {
		const data = {
			x: Symbol('x'),
		};
		const config = { bulletYAxis: Symbol('y') };

		const result = positions.player({ data, config });
		const expected = {
			x: data.x,
			y: config.bulletYAxis,
		};

		expect(result).toEqual(expected);
	});

	describe('isActive', () => {
		const returnValue = Symbol('Future');
		const power = Symbol('doubleBullet');
		const state = { durations: { power }};
		const context = {
			state,
		};

		test('whether isFuture is called', () => {
			jest.spyOn(bulletManager, 'isFuture').mockReturnValue(returnValue);

			const result = bulletManager.isActive(context, power);

			expect(bulletManager.isFuture)
				.toHaveBeenCalledWith(state.durations[power]);
			expect(result).toEqual(returnValue);
		});
	});
	describe('isFuture', () => {
		const msPerDay = 86400000;
		const expectations = [
			['past', false, Date.now() - msPerDay],
			['future', true, Date.now() + msPerDay],
		];

		test.each(expectations)('when input date is in the %p than'
			+ 'new date isFuture returns %p ',
		(
			dummy, expectation, value
		) => {
			expect(bulletManager.isFuture(value)).toEqual(expectation);
		});
	});

	test('generateBullets', () => {
		const bullets = [Symbol('bullets')];
		const bullet = [Symbol('bullet')];
		const state = { bullets };
		const data = { team: random.rndValue(['player', 'enemy']) };
		const context = { data, state };

		jest.spyOn(bulletManager.makeBullets, data.team)
			.mockReturnValue(bullet);

		const result = bulletManager.generateBullets(context);
		const expected = [...bullets, ...bullet];

		expect(bulletManager.makeBullets[data.team])
			.toHaveBeenCalledWith(context);
		expect(result).toEqual(expected);
	});

	describe('makeBullets', () => {
		test('makeEnemyBullets', () => {
			const config = {
				rndLength: Symbol('rndLength'),
				targets: five,
				shootingProb: Symbol('shootingProb'),
				maxTargets: five,
			};
			const targets = [Symbol('targets')];
			const state = { targets };
			const bullet = Symbol('bullet');
			const data = { team: 'enemy' };
			const randomTargets = [Symbol('targets')];
			const context = { config, data, state };
			const canShoot = true;
			const rndBetweenValue = Symbol('rndBetweenValue');

			jest.spyOn(HelperService, 'isProbable').mockReturnValue(canShoot);
			jest.spyOn(random, 'rndValues').mockReturnValue(randomTargets);
			jest.spyOn(bulletManager, 'makeBullet')
				.mockReturnValue(bullet);
			jest.spyOn(random, 'rndBetween').mockReturnValue(rndBetweenValue);

			const expected = map(randomTargets, () => bullet);

			const result = bulletManager.makeBullets[data.team](context);

			expect(result).toEqual(expected);
			expect(HelperService.isProbable)
				.toHaveBeenCalledWith(config.shootingProb);
			expect(random.rndValues)
				.toHaveBeenCalledWith(state.targets, rndBetweenValue);
			map(randomTargets, (target) =>
				expect(bulletManager.makeBullet)
					.toHaveBeenCalledWith({ ...context,
						data: { ...data, target }}));
		});

		const bulletPosition = Symbol('bulletPosition');
		const data = { team: 'player' };
		const state = {
			flight: {
				x: Symbol('x'),
			},
		};
		const config = {
			bulletCount: {
				defaultCount: 1,
				double: 2,
			},
		};
		const expectations = [[true, bulletPosition, 2],
			[false, state.flight.x, 1]];

		test.each(expectations)('makePlayerBullet',
			(
				boolean, position, bulletCount
			) => {
				const bullet = Symbol('bullet');
				const context = { state, config, data };
				const extendedContext = { ...context,
					data: { ...data, x: position }};

				jest.spyOn(bulletManager, 'isActive').mockReturnValue(boolean);
				boolean && jest.spyOn(PositionService, 'getBulletPosition')
					.mockReturnValue(position);
				jest.spyOn(bulletManager, 'makeBullet')
					.mockReturnValue(bullet);

				const expected = map(range(0, bulletCount), () => bullet);

				const result = bulletManager.makeBullets[data.team](context);

				expect(result).toEqual(expected);
				map(range(0, bulletCount), () =>
					expect(bulletManager.makeBullet)
						.toHaveBeenCalledWith(extendedContext));
			});
	});

	test('makeBullet', () => {
		const data = { team: 'enemy' };
		const id = Symbol('id');
		const config = { rndLength: Symbol('rndString') };
		const positionValue = Symbol('positionValue');
		const getTypeValue = Symbol('getTypeValue');
		const context = { data, config };

		jest.spyOn(bulletManager.positions, data.team)
			.mockReturnValue(positionValue);
		jest.spyOn(bulletManager, 'getType')
			.mockReturnValue(getTypeValue);
		jest.spyOn(random, 'rndString').mockReturnValue(id);

		const result = makeBullet(context);
		const expected = {
			id: id,
			isHit: false,
			team: data.team,
			...positionValue,
			...getTypeValue,
		};

		expect(result).toEqual(expected);
		expect(bulletManager.positions[data.team])
			.toHaveBeenCalledWith(context);
		expect(bulletManager.getType).toHaveBeenCalledWith(context);
		expect(random.rndString).toHaveBeenCalledWith(config.rndLength);
	});
});
