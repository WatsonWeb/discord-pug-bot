'use strict';


// Dependencies
const { maps } = require('../config/bot-config.json');


module.exports = {
	name: 'map',
	description: 'Selects a random map',
	admin_only: false,
	execute(message) {
		// Select random map
		const random_map = Math.floor(Math.random() * maps.length);

		// Send message
		message.channel.send('>>> **:map: Map:** ' + maps[random_map]);
	},
};
