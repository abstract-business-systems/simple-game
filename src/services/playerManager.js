import PositionService from './positionService';
import { find, values } from '@laufire/utils/collection';
import * as helper from './helperService';
import { rndString } from '@laufire/utils/random';
import * as helperService from '../services/helperService';
import { adjustTime } from './ticker/timeService';

const hundred = 100;

const moveBullet = {
	player: -1,
	enemy: 1,
};

const PlayerManager = {
	isAlive: ({ state }) => state.health > 0,

	decreaseHealth: ({ state, config }) => ({
		health: state.health - config.damage,
	}),

	backGroundMovingAxis: ({ state, config }) => ({
		bgnScreenY: (state.bgnScreenY + config.bgnScreenYIncre) % hundred,
	}),

	updateBackgroundObjects: ({ state, config, data }) =>
		state[data].map((obj) => ({
			...obj,
			y: obj.y + config.bgnScreenYIncre,
		})),

	resetBackgroundObjects: ({ state }) =>
		state.objects.filter((obj) => obj.y < hundred),

	moveBullets: ({ state, config }) =>
		state.bullets.map((bullet) => ({
			...bullet,
			y: bullet.y
				+ (moveBullet[bullet.team] * config.moveBulletPercentage),
		})),

	detectBulletHit: ({ state: { targets, bullets }}) =>
		bullets.map((bullet) => ({
			...bullet,
			isHit: PlayerManager.isBulletHit(targets, bullet),
		})),

	getObjects: (context) => ({
		x: PositionService.getRandomValue(context.data.width),
		y: -PositionService.getRandomValue(context.data.height),
		id: rndString(context.config.rndLength),
		...context.data,
	}),

	createObjects: (context) => context.data
		.filter(({ prob }) => helperService.isProbable(prob))
		.map((item) => PlayerManager.getObjects({
			...context,
			data: item,
		})),

	generateObjects: (context) => {
		const { data: gameObject } = context;

		return [
			...context.state[gameObject],
			...PlayerManager.createObjects({
				...context, data: values(context.config[gameObject]),
			}),
		];
	},

	removeHitBullets: ({ state: { bullets }}) =>
		bullets.filter((data) => data.isHit !== true),

	detectOverLapping: (bullet, target) =>
		find(bullet, (value) => PositionService.isPointInRect(value, target)),

	isBulletHit: (bullet, target) => {
		const bulletPoints = PositionService.getAllPoints(bullet);
		const targetPoints = PositionService.getAllPoints(target);

		const isOverlapped = PlayerManager.detectOverLapping(bulletPoints,
			targetPoints);

		return isOverlapped !== undefined;
	},

	filterBullet: (bullets, target) =>
		bullets.filter((bullet) => PlayerManager.isBulletHit(bullet, target)),

	filterTeamBullets: ({ bullets, team }) =>
		bullets.filter((bullet) => bullet.team === team),

	collectHits: ({ data: { team, flights, bullets }}) => {
		const targets = flights[team];
		const filteredBullets = PlayerManager.filterTeamBullets({
			bullets,
			team,
		});

		return targets.map((target) =>
			PlayerManager.collectEachTargetHits(target, filteredBullets));
	},

	collectEachTargetHits: (target, bullets) => ({
		target: target,
		bullets: PlayerManager.filterBullet(bullets, target),
	}),

	updateHealth: (hits) =>
		hits.map(({ target, bullets }) => ({
			...target,
			health: PlayerManager.calDamage(target, bullets),
		})),

	updateBulletIsHit: (hitBullets, bullets) => {
		const bulletsId = hitBullets.map((bullet) => bullet.id);

		return bullets.map((bullet) => ({
			...bullet,
			isHit: bulletsId.includes(bullet.id),
		}));
	},

	// eslint-disable-next-line max-lines-per-function
	processHits: (context) => {
		const {
			state: { bullets, targets, flight, health },
		} = context;
		const flights = {
			enemy: [{ ...flight, health }],
			player: targets,
		};
		const data = { bullets, flights };
		const [playerHits, enemyHits] = ['player', 'enemy'].map((team) =>
			PlayerManager.collectHits({
				...context,
				data: { ...data, team },
			}));
		const [{ health: flightHealth }] = PlayerManager
			.updateHealth(enemyHits);

		return {
			targets: PlayerManager.updateHealth(playerHits),
			health: flightHealth,
			bullets: PlayerManager.updateBulletIsHit(helper
				.flattenObjects({ hits: [
					...enemyHits,
					...playerHits,
				], data: 'bullets' }),
			bullets),
		};
	},

	collectEachHits: (target, powers) => ({
		target: target,
		powers: PlayerManager.filterBullet(powers, target),
	}),

	collectPowerHits: (context) => {
		const [targets, powers] = context.data;

		return targets.map((target) =>
			PlayerManager.collectEachHits(target, powers));
	},

	activatePower: (context, hits) => {
		const { config: { powers }} = context;
		const powersType = hits.map((power) => power.type);

		return powersType.reduce((acc, type) => ({
			[type]: adjustTime(
				Date.now(), powers[type].duration, 'seconds'
			),
		}), {}) ;
	},

	processPower: (context) => {
		const { state: { flight, powers, duration }} = context;
		const hits = PlayerManager
			.collectPowerHits({ ...context, data: [[flight], powers] });
		const flattenPowers = helper
			.flattenObjects({ hits: hits, data: 'powers' });

		return {
			durations: {
				...duration,
				...PlayerManager.activatePower(context, flattenPowers),
			},
			powers: PlayerManager.removePowers(powers, flattenPowers),
		};
	},

	calDamage: (target, bullets) =>
		Math.max(target.health - bullets.reduce((a, c) => a + c.damage, 0), 0),

	updateScore: ({ state: { targets, score }}) =>
		targets.reduce((a, target) => (target.health === 0 ? a + 1 : a), score),

	removeTargets: ({ state: { targets }}) =>
		targets.filter((target) => target.health !== 0),

	removePowers: (powers, hitPowers) => {
		const powersId = hitPowers.map((hitPower) => hitPower.id);

		return powers.filter((power) => !powersId.includes(power.id));
	},
};

export default PlayerManager;
