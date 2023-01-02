const low = 20;
const mid = 50;

const GameService = {

	healthColor: (health) =>
		(health <= low
			? 'red'
			: health <= mid
				? 'yellow'
				: 'greenYellow'),

	ceilHealth: (health) =>
		Math.ceil(health),
};

export default GameService;
