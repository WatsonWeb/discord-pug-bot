'use strict';


// Dependencies
const { entries } = require('../config/sequelize-config');


module.exports = {
	name: 'leaderboard',
	description: 'Post a leaderboard for Entries',
	admin_only: false,
	execute(message) {
		const entrypromise = entries.findAll({ order: [['entry_count', 'DESC']] });

		entrypromise.then(entry => {
			if (entry == null) {
				console.error('Error retrieving entries');
			}
			else {
				let reply = '>>> **:trophy: Giveaway Leaderboard :trophy:**\n\n';
				let total_entries = 0;
				let place = 1;
				entry.forEach(user => {

					// Emojis
					if (place === 1) { reply += ':first_place: '; }
					else if (place === 2) { reply += ':second_place: '; }
					else if (place === 3) { reply += ':third_place: '; }

					reply += user.user_name + ' - ' + user.entry_count + '\n';

					if (place === 3) { reply += '\n'; }

					total_entries += user.entry_count;
					place++;
				});
				reply += `\n**Total Entries - ${total_entries}**`;

				message.channel.send(reply);
			}
		});
	},
};
