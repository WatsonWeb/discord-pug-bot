'use strict';


// Dependencies
const CONFIG = require('../config/bot-config.json');
const { queue } = require('../config/sequelize-config');


module.exports = {
	name: 'queue',
	description: 'Shows the users currently in Queue',
	admin_only: false,
	execute(message) {
		let queueMessage = '>>> **:timer: Queue :timer:\n\nTotal in queue: **';

		queue.findAndCountAll()
			.then(result => {
				queueMessage += result.count + '/' + CONFIG.player_limit + '\n\n';

				if (result.count >= CONFIG.player_limit) {
					queueMessage += '**@here Queue is full! Let\'s game! :grin:**\n\n';
				}

				if (result.count == 0) {
					queueMessage += 'There is nobody in queue :cry:\n';
				}

				result.rows.forEach(user => {
					queueMessage += user.user_name + '\n';
				});

				if (result.count < CONFIG.player_limit) {
					queueMessage += '\n You can join the queue by typing "!join"';
				}

				message.channel.send(queueMessage);
			})
			.catch(error => {
				console.error('There was an error showing the queue: ' + error);
			});
	},
};
