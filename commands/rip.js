'use strict';


// Dependencies
const USERS = require('../app/users');


module.exports = {
	name: 'rip',
	description: 'Move all users to the lobby channel',
	admin_only: true,
	execute(message, CHANNELS) {

		let activeMembers = USERS.getActiveMembers(CHANNELS.voiceChannels);

		if (!activeMembers.length) {
			message.channel.send('No players to move!');
			return false;
		}

		// Move members back to lobby
		activeMembers.forEach(member => {
			member.voice.setChannel(CHANNELS.queueChannel[0])
				.catch(() => {
					console.error('Error moving user back to lobby');
				});
		});

		message.channel.send('RIP - Thanks for playing! :skull: ');
	},
};
