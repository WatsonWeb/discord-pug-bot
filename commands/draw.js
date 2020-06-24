'use strict';


// Dependencies
const { entries } = require('../config/sequelize-config');


module.exports = {
	name: 'draw',
	description: 'Draw a giveway winner based on the number of Entries',
	admin_only: true,
	args: true,
	usage: '<# of users to draw>',
	execute(message, CHANNELS, args) {

		// Gather array of all entries from database
		entries.findAll({ order: [['entry_count', 'DESC']] }).then((entryArray) => {
			if (entryArray == null) {
				console.error('Error drawing winner');
				message.channel.send('Sorry I couldn\'t draw a winner.');
			}
			else {
				let drawsLimit = 1;
				let winnerMessage = '>>> **:trophy: The winner is: ';
				const winnersArray = entryArray;

				// Multiple draws
				if (args.length && !isNaN(parseInt(args[0]))) {
					drawsLimit = parseInt(args[0]);
					winnerMessage = '>>> **:trophy: The winners are: ';

					if (drawsLimit > winnersArray.length) {
						return message.reply('You are trying to draw too many winners!');
					}
				}

				// Loop over number of draws
				for (let i = 0; i < drawsLimit; i++) {
					let total_entries = 0;
					let running_total = 0;

					// Tally total entries
					winnersArray.forEach((user) => {
						total_entries += user.entry_count;
					});

					// Skip if there is no entries
					if (total_entries === 0) return;

					// Calculate random winning number between 1 - # of total entries
					const winning_number = Math.floor(Math.random() * total_entries);

					// Loop through users to determine the winner
					for (const [n, user] of winnersArray.entries()) {
						running_total += user.entry_count;
						if (winning_number <= running_total) {
							winnerMessage += '<@' + user.user_id.toString() + '>';
							if (i + 1 < drawsLimit) {
								winnerMessage += ', ';
							}
							// Remove winner from array to recalculate next draw fairly
							winnersArray.splice(n, 1);
							break;
						}
					}
				}

				winnerMessage += '! :trophy:**';

				// Send message
				return message.channel.send(winnerMessage);
			}
		});
	},
};
