import fighterJet from '../images/fighterJet.png';
import bulletImage from '../images/bullet.png';

const config = {
	tickerDelay: 100,
	health: 100,
	damage: 0.1,
	rndLength: 16,
	bullet: {
		normal: {
			height: 2,
			width: 1,
			image: bulletImage,
		},
	},
	moveBulletPercentage: 5,
	bgnScreenYIncre: 1,
	maxTargets: 5,
	targets: {
		shooter: {
			health: 1,
			damage: 1,
			type: 'shooter',
			image: fighterJet,
			height: 6,
			width: 6,
			variance: 0.2,
			prop: {
				spawn: 1,
			},
		},
	},
};

export default config;
