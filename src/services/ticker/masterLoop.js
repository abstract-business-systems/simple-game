import context from '../../core/context';

const masterLoop = [
	'decreaseHealth',
	'backGroundMovingAxis',
	'addTargets',
	'generateObjects',
	'generatePowers',
	'updateObjects',
	'updatePowers',
	'resetObjects',
	'moveBullets',
	'processBullets',
	'clearHitBullets',
	'updateScore',
	'removeTargets',
	'generateEnemyBullets',
	'processPowers',
];

const runMasterLoop = () =>
	masterLoop.forEach((data) => context.actions[data]());

const master = {
	runMasterLoop,
	masterLoop,
};

export default master;
