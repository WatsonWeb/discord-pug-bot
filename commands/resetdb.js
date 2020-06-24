'use strict';


// Dependencies
const DATABASE = require('../config/sequelize-config');


module.exports = {
	name: 'resetdb',
	description: 'Resets the database',
	admin_only: true,
	execute(message) {

		for (const table in DATABASE) {
			DATABASE[table].truncate();
		}

		message.channel.send('>>> :recycle: Leaderboard and Queue has been reset :recycle:');
	},
};
