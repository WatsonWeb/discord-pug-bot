'use strict';


// Dependencies
const { queue } = require('../config/sequelize-config');


module.exports = {
	name: 'leave',
	description: 'Leaves the Queue',
	admin_only: false,
	execute(message) {
		queue.findOne({ where: { user_id: message.member.id } })
			.then(member => {
				if (member == null) {
					return message.reply('Sorry I couldn\'t find you in the Queue');
				}

				member.destroy().then(() => {
					return message.reply('You have left the Queue! :cry:');
				});
			})
			.catch(() => {
				console.error('There was an error removing a member from the queue');
			});
	},
};
