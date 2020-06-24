'use strict';


// Config
const CONFIG	= require('./config/bot-config.json');
const DATABASE	= require('./config/sequelize-config');

// Discord Bot
const DISCORD	= require('./app/discord');
const CHANNELS 	= require('./app/channels');
const USERS 	= require('./app/users');

// Bot Ready
DISCORD.client.once('ready', () => {

	// Sequelize initialize
	for (const table in DATABASE) {
		DATABASE[table].sync();
	}

	// Set channels
	CHANNELS.voiceChannels	= CHANNELS.getVoiceChannels(DISCORD.client, CONFIG.watched_channels);
	CHANNELS.queueChannel	= CHANNELS.getVoiceChannels(DISCORD.client, CONFIG.queue_channel);

	// Get array of active users every 'x' minutes and increment entries in database
	if (CHANNELS.voiceChannels.length) {
		setInterval(function() {
			const activeUsers = USERS.getActiveUsers(CHANNELS.voiceChannels);

			// Update database
			if (activeUsers.length) {
				activeUsers.forEach(user => {
					DATABASE.entries.findOrCreate({ where: { user_id: user[0] }, defaults: { user_name: user[1] } })
						.then(([member]) => {
							if (member) { member.increment('entry_count'); }
						});
				});
			}
		}, CONFIG.timer_minutes * 60 * 1000);
	}

	// Log bot is ready
	console.info('Bot Ready!');
});


// Message Listener
DISCORD.client.on('message', async message => {

	/* Ignore if message:
	1. Does not start with prefix
	2. Is from a bot
	3. Is not in the bot channel (see bot-config.json) */
	if (!message.content.startsWith(CONFIG.prefix)
		|| message.author.bot
		|| message.channel.name !== CONFIG.bot_channel
	) return;

	// Get command and arguments
	const args = message.content.slice(CONFIG.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = DISCORD.client.commands.get(commandName)
		|| DISCORD.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// Ignore if not a valid command
	if (!command) return;

	// Admin-only command filtering
	if (command.admin_only === true && !message.member.hasPermission('MOVE_MEMBERS')) {
		return message.reply('Sorry, that command is for 10-Man Moderators only');
	}

	// Reply if user PMs the bot with a server-only command
	if (command.serverOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs');
	}

	// Reply with proper command / arguements usage
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${CONFIG.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Execute commands
	try {
		command.execute(message, CHANNELS, args);
	}

	// Catch command errors
	catch (e) {
		console.error(e);
		message.reply('There was an error trying to execute that command!');
	}
});


// Login with Bot Token from bot-config.json
DISCORD.client.login(CONFIG.token);