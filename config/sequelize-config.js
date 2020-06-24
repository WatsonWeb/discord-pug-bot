'use strict';

// Depencies
const Sequelize = require('sequelize');

// Local Sequelize setup
// const CONFIG = require('./bot-config.json');
// const sequelize = new Sequelize(CONFIG.connection.database, CONFIG.connection.username, CONFIG.connection.password, {
// 	host: CONFIG.connection.host,
// 	dialect: 'postgres',
// 	logging: false,
// });

// Production
const sequelize = new Sequelize(process.env.DATABASE_URL);

// Sequelize - SQLite Database Structure
const Entries = sequelize.define('entries',
	{
		user_id: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		user_name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		entry_count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	});

const Queue = sequelize.define('queue',
	{
		user_id: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		user_name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
	});

const MessageQuota = sequelize.define('messagequota',
	{
		message_type: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		time: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
	});

module.exports = {
	entries: Entries,
	queue: Queue,
	messageQuota: MessageQuota,
};