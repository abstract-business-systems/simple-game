import config from './config';
import doubleBullet from '../images/double.png';

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
	duration: {
		doubleBullet: Date.now(),
	},
	powers: [{
		width: 5,
		height: 10,
		type: 'doubleBullet',
		prob: 0.01,
		image: doubleBullet,
		x: 50,
		y: -10,
		id: 'OJDKNDLKOSNDKJAD',
	}],
	bullets: [],
	enemyBullets: [],
};

export default seed;
