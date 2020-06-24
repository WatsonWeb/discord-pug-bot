'use strict';


// Dependencies
const CONFIG	= require('../config/bot-config.json');
const USERS		= require('../app/users');

// Array shuffle helper
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// Exports
module.exports = {
	name: 'autodraft',
	description: 'Created randomized "fair" teams based on rank roles and moves players into team lobbies',
	admin_only: true,
	execute(message, CHANNELS) {

		if (!CHANNELS.voiceChannels.length) {
			console.error('No channels supplied to autodraft');
			return false;
		}

		// Gather list of active members
		let activeMembers = USERS.getActiveMembers(CHANNELS.voiceChannels);
		const rankedMembers = [];
		const teamA = [];
		const teamB = [];

		if (!activeMembers.length) {
			console.error('No active users found in autodraft');
			return false;
		}

		// Shuffle
		activeMembers = shuffle(activeMembers);
		// Player limit
		activeMembers = activeMembers.slice(0, CONFIG.player_limit);

		// Sort by rank role
		CONFIG.ranks.forEach(rank => {

			// Loop Users
			for (let i = 0; i < activeMembers.length; i++) {

				let hasRank = false;

				// Loop Roles
				for (const role of activeMembers[i].roles.cache) {

					if (role[1].name == rank) {
						rankedMembers.push(activeMembers[i]);
						hasRank = true;
						break;
					}
				}

				if (hasRank) {
					activeMembers.splice(i, 1);
					if (i > 0) { i--; }
				}
			}

		});

		if (!rankedMembers.length) {
			console.error('No ranked users found in autodraft');
			return false;
		}

		// Split ranked members into teams
		for (const [i, member] of rankedMembers.entries()) {
			if (i % 2 == 0) {
				teamA.push(member);
			}
			else {
				teamB.push(member);
			}
		}

		// Autodraft message
		let autodraftMessage = '>>> **:crossed_swords: Auto-Draft Teams :crossed_swords:\n\n';

		// Select random map
		const random_map = Math.floor(Math.random() * CONFIG.maps.length);
		autodraftMessage += ':map: Map:** ' + CONFIG.maps[random_map] + '\n\n**Team A:**\n';

		// Move teams into lobbies
		teamA.forEach((member) => {
			member.voice.setChannel(CHANNELS.voiceChannels[1]);
			autodraftMessage += member.user.username + '\n';
		});

		autodraftMessage += '\n**Team B:**\n';

		teamB.forEach((member) => {
			member.voice.setChannel(CHANNELS.voiceChannels[2]);
			autodraftMessage += member.user.username + '\n';
		});

		// Send Message
		message.channel.send(autodraftMessage);
	},
};