'use strict';


// Dependencies
const { messageQuota } = require('../config/sequelize-config');

module.exports = {
	name: 'clearquota',
	description: 'Clears the message quota',
	admin_only: true,
	execute(message) {
		messageQuota.truncate();

		message.channel.send('>>> :recycle: Message Quota has been cleared :recycle:');
	},
};
