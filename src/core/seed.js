import config from './config';

const seed = {
	position: {
		x: 0,
		y: 0,
	},
	health: config.health,
	score: 0,
	bgnScreenY: 10,
	ready: false,
	audio: false,
	help: false,
	playPause: false,
	flight: config.flight,
	targets: [],
	objects: [],
	bullets: [],
	enemyBullets: [],

};

export default seed;
