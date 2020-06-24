'use strict';


// Dependencies
const { entries } = require('../config/sequelize-config');


module.exports = {
	name: 'clearentries',
	description: 'Delete a user from the Entries database',
	admin_only: true,
	usage: '<user>',
	args: true,
	execute(message) {

		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to delete their entries!');
		}

		const taggedUser		= message.mentions.users.first();
		const taggerUsername	= taggedUser.username;
		const entrypromise		= entries.findOne({ where: { user_id: taggedUser.id } });

		entrypromise.then(entry => {
			if (entry == null) {
				message.reply('There was an error deleting the user\'s entries');
			}
			else {
				entry.destroy().then(() => {
					message.channel.send('>>> ' + taggerUsername + '\'s entries have been deleted');
				});
			}
		});
	},
};
