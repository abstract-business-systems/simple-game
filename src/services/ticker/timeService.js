const sixty = 60;
const hoursPerDay = 24;
const seconds = 1000;
const minutes = sixty * seconds;
const hours = sixty * minutes;
const days = hoursPerDay * hours;

const msTable = {
	days,
	hours,
	minutes,
	seconds,
};

const adjustTime = (
	dateValue, adjustment, unit
) =>
	dateValue + (adjustment * msTable[unit]);

export { adjustTime };
