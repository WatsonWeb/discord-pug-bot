'use strict';


// Dependencies
const Discord = require('discord.js');
const fs = require('fs');

// Discord Client
const client = new Discord.Client();

// Get list of commands from commands folder
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	client.commands.set(command.name, command);
}

// Exports
module.exports = {
	client,
};