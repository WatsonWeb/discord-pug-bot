'use strict';


// Dependencies
const { queue } = require('../config/sequelize-config');


module.exports = {
	name: 'unqueue',
	description: 'Removes a user from the Queue',
	admin_only: true,
	args: true,
	usage: '<user>',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to remove them from the queue!');
		}

		const taggedUser = message.mentions.users.first();

		queue.findOne({ where: { user_id: taggedUser.id } })
			.then(member => {
				if (member == null) {
					return message.reply('Sorry I couldn\'t find that user in the Queue');
				}

				member.destroy().then(() => {
					return message.reply(taggedUser.username + ' has been removed from the Queue! :cry:');
				});
			})
			.catch(() => {
				console.error('There was an error removing a member from the queue');
			});
	},
};