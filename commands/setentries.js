'use strict';


// Dependencies
const { entries } = require('../config/sequelize-config');


module.exports = {
	name: 'setentries',
	description: 'Set a users number of Entries',
	admin_only: true,
	args: true,
	usage: '<user> <# of entries>',
	execute(message, CHANNELS, args) {

		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to set their entries!');
		}

		const taggedUser = message.mentions.users.first();
		const entryNumber = parseInt(args[1]);

		if (isNaN(entryNumber)) {
			return message.reply('You need to specify a number of entries!');
		}

		const entrypromise = entries.findOne({ where: { user_id: taggedUser.id } });

		entrypromise.then(entry => {
			if (entry == null) {
				message.reply('There was an error setting the user\'s entries');
			}
			else {
				entry.update({ entry_count: entryNumber }).then(() => {
					message.channel.send('>>> ' + taggedUser.username + '\'s entries have been set to: ' + entryNumber);
				});
			}
		});
	},
};
