import context from '../../core/context';

const masterLoop = [
	'decreaseHealth',
	'backGroundMovingAxis',
	'addTargets',
	'generateObjects',
	'updateObjects',
	'resetObjects',
	'moveBullets',
	'processBullets',
	'processEnemyBullets',
	'clearHitBullets',
	'updateScore',
	'removeTargets',
	'generateEnemyBullets',
];

const runMasterLoop = () =>
	masterLoop.forEach((data) => context.actions[data]());

const master = {
	runMasterLoop,
	masterLoop,
};

export default master;
