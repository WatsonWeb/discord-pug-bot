'use strict';


// Dependencies
const { token } = require('../config/bot-config.json');


module.exports = {
	name: 'restart',
	description: 'Restarts the bot',
	admin_only: true,
	execute(message) {
		message.channel.send('>>> :recycle: Restarting... ');
		message.client.destroy();
		message.client.login(token)
			.then(() => {
				message.channel.send('>>> Bot Restarted! ');
			})
			.catch(() => {
				console.error('Error restarting the bot');
			});
	},
};
