'use strict';


// Dependencies
const { prefix } = require('../config/bot-config.json');


module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	admin_only: false,
	usage: '<command name>',
	execute(message, CHANNELS, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands:\n');

			// Admin-only commands
			if (message.member.hasPermission('ADMINISTRATOR')) {
				data.push(commands.map(command => command.name).join('\n'));
			}
			// Regular commands
			else {
				const regularCommands = [];
				commands.forEach(command => {
					if(!command.admin_only) {
						regularCommands.push(command.name);
					}
				});
				data.push(regularCommands.join('\n'));
			}

			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name);

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		message.channel.send(data, { split: true });
	},
};
