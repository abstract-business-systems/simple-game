import { rndBetween } from '@laufire/utils/random';

const hundred = 100;
const two = 2;

const PositionService = {

	getBulletPosition: ({ state: { flight: { x, width }},
		config: { quad }}) => {
		const flightQuarter = width / quad;

		return rndBetween(x - flightQuarter, x + flightQuarter);
	},
	limitMovement: ({ state: { flight: { width }, position: { x }}}) =>
		Math.min(hundred - (width / two), Math
			.max(x, 0 + (width / two))),

	pxToPercentage: (xPos, innerWidth) =>
		xPos / innerWidth * hundred,

	getRandomValue: (data) =>
		rndBetween(data / two, hundred - (data / two)),

	isPointInRect: ({ x, y }, { topLeft, bottomRight }) =>
		topLeft.x <= x && x <= bottomRight.x
		&& topLeft.y <= y && y <= bottomRight.y,

	getAllPoints: (rec) => ({
		topLeft: {
			x: rec.x - (rec.width / two),
			y: rec.y - (rec.height / two),
		},
		bottomRight: {
			x: rec.x + (rec.width / two),
			y: rec.y + (rec.height / two),
		},
	}),

	threeDProject: ({ config, data, viewport: { width, height }}) => ({
		...data,
		x: (data.x * width / hundred) - (width / two),
		y: config.threeDProjectY,
		z: (data.y * height / hundred) - (height / two),
		width: data.width * width / hundred,
		height: data.height * height / hundred,
	}),

	getHealthProps: (context) => {
		const {
			state: { health: healthPercentage },
			config: { health },
			data,
		} = context;
		const width = data.width * healthPercentage / health;
		const XPosition = -(data.width - width) / two;

		return { width, XPosition };
	},

};

export default PositionService;
