/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import * as random from '@laufire/utils/random';
import positionService from './positionService';

describe('PositionService', () => {
	const { project,
		limitMovement,
		pxToPercentage,
		getRandomValue,
		getAllPoints,
		isPointInRect,
		detectOverLapping,
		isBulletHit,
		getTargetsPoints } = positionService;
	const twentyFive = 25;
	const hundred = 100;
	const two = 2;
	const width = 6;
	const innerWidth = 1000;
	const thousand = 1000;
	const range = random.rndBetween(twentyFive, hundred);
	const returnValue = Symbol('returnValue');
	const x = random.rndBetween(twentyFive, hundred);
	const y = random.rndBetween(twentyFive, hundred);
	const rectWidth = random.rndBetween(twentyFive, hundred);
	const height = random.rndBetween(twentyFive, hundred);

	test('project', () => {
		const data = { x: 10, width: 1 };
		const result = project(data);

		expect(result).toBeTruthy();
	});

	test('limitMovement returns value greater than or equal to 0', () => {
		jest.spyOn(Math, 'max').mockReturnValue(returnValue);
		jest.spyOn(Math, 'min').mockReturnValue(returnValue);

		const context = { state: { flight: { width: 6 }, position: { x: 1 }}};

		const result = limitMovement(context);

		expect(result).toEqual(returnValue);
		expect(Math.max)
			.toHaveBeenCalledWith(context.state.position.x,
				context.state.flight.width / two);
		expect(Math.min)
			.toHaveBeenCalledWith(hundred - (width / two), returnValue);
		expect(result).toEqual(returnValue);
	});

	test('returns value converted from px to percentage', () => {
		for(let i = 0; i <= thousand; i++) {
			const xpx = Math.floor(Math.random() * innerWidth);
			const result = pxToPercentage(xpx, innerWidth);

			expect(result).toBeLessThanOrEqual(hundred);
		}
	});

	test('get random value for height and width', () => {
		const data = range;
		const min = range / two;
		const max = hundred - min;

		jest.spyOn(random, 'rndBetween').mockReturnValue(returnValue);

		const result = getRandomValue(data);

		expect(random.rndBetween).toHaveBeenCalledWith(min, max);
		expect(result).toEqual(returnValue);
	});

	describe('detectOverLapping', () => {
		const targetValue = Symbol('targetValue');
		const expectations = [
			[false, undefined],
			[true, targetValue],
		];

		test.each(expectations)('detectOverLapping %p',
			(returnFlag, expected) => {
				const target = { targetValue };
				const bullet = Symbol('bullet');

				jest.spyOn(positionService, 'isPointInRect')
					.mockReturnValue(returnFlag);

				const result = detectOverLapping(target, bullet);

				expect(result).toEqual(expected);
				expect(positionService.isPointInRect)
					.toHaveBeenCalledWith(targetValue, bullet);
			});
	});

	describe('isPointInRect', () => {
		const expectations = [
			['toBeTruthy', { x: 17, y: 13 }],
			['toBeFalsy', { x: 21, y: 13 }],
		];

		test.each(expectations)('isPointInRect %p', (expected, point) => {
			const topLeft = {
				x: 15,
				y: 20,
			};

			const bottomRight = {
				x: 20,
				y: 10,
			};
			const rectPoints = { topLeft, bottomRight };

			const result = isPointInRect(point, rectPoints);

			expect(result)[expected]();
		});
	});
	test('getAllPoints', () => {
		const rect = { x, y, height };
		const expectation = {
			topLeft: {
				x,
				y,
			},
			topRight: {
				x: x + rectWidth,
				y: y,
			},
			bottomLeft: {
				x: x,
				y: y + height,
			},
			bottomRight: {
				x: x + rectWidth,
				y: y + height,
			},
		};
		const result = getAllPoints({ ...rect, width: rectWidth });

		expect(result).toMatchObject(expectation);
	});

	describe('isBulletHit', () => {
		const target = Symbol('target');
		const expectations = [
			['toBeFalsy', undefined],
			['toBeTruthy', target],
		];

		test.each(expectations)('isBulletHit %p',
			(expected, detectOverlap) => {
				const targets = Symbol('targetsValue');
				const bullet = Symbol('bulletValue');

				jest.spyOn(positionService, 'getTargetsPoints')
					.mockReturnValue([target]);
				jest.spyOn(positionService, 'detectOverLapping')
					.mockReturnValue(detectOverlap);
				jest.spyOn(positionService, 'getAllPoints')
					.mockReturnValue(bullet);

				const result = isBulletHit(targets, bullet);

				expect(positionService.getTargetsPoints)
					.toHaveBeenCalledWith(targets);
				expect(positionService.detectOverLapping)
					.toHaveBeenCalledWith(target, bullet);
				expect(positionService.getAllPoints)
					.toHaveBeenCalledWith(bullet);

				expect(result)[expected]();
			});
	});

	test('getTargetsPoints', () => {
		const targets = [Symbol('targets')];
		const target = Symbol('target');

		jest.spyOn(targets, 'map').mockReturnValue(target);
		jest.spyOn(positionService, 'getAllPoints');

		const result = getTargetsPoints(targets);

		expect(result).toEqual(target);
		expect(targets.map).toHaveBeenCalledWith(positionService.getAllPoints);
	});
});
