'use strict';


// Dependencies
const { queue } = require('../config/sequelize-config');

module.exports = {
	name: 'clearqueue',
	description: 'Clears the queue',
	admin_only: true,
	execute(message) {
		queue.truncate();

		message.channel.send('>>> :recycle: Queue has been cleared :recycle:');
	},
};
