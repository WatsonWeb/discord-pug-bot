'use strict';


// Dependencies
const USERS = require('../app/users');


module.exports = {
	name: 'lobby',
	description: 'Move all users in the team lobbies to the Lobby',
	admin_only: true,
	execute(message, CHANNELS) {

		let activeMembers = USERS.getActiveMembers(CHANNELS.voiceChannels);
		activeMembers = activeMembers.concat(USERS.getActiveMembers(CHANNELS.queueChannel));

		if (!activeMembers.length) {
			message.channel.send('No players to move!');
			return false;
		}

		// Move members back to lobby
		activeMembers.forEach(member => {
			member.voice.setChannel(CHANNELS.voiceChannels[0])
				.catch(() => {
					console.error('Error moving user back to lobby');
				});
		});

		message.channel.send('Players moved back to lobby! :arrow_heading_up:');
	},
};
