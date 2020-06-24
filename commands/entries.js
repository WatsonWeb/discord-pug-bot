'use strict';


// Dependencies
const { entries } = require('../config/sequelize-config');


module.exports = {
	name: 'entries',
	description: 'Reply with the users number of Entries',
	admin_only: false,
	execute(message) {
		const entrypromise = entries.findOne({ where: { user_id: message.author.id } });

		entrypromise.then(entry => {
			if (entry == null) {
				message.reply('Sorry I couldn\'t find any entries under your name!');
			}
			else {
				message.reply('You have earned ' + entry.entry_count + ' entries! :tickets:');
			}
		});
	},
};
