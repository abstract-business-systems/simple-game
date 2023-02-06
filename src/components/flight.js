import React from 'react';

const Flight = (context) => {
	const { state: { flight: { x }}} = context;

	return (
		<div
			role="flight"
			className="flight"
			style={ { left: `${ x }%` } }
		/>);
};

export default Flight;
