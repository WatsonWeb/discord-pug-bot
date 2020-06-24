'use strict';


// Dependencies
const CONFIG = require('../config/bot-config.json');
const { queue, messageQuota } = require('../config/sequelize-config');


module.exports = {
	name: 'join',
	description: 'Joins the Queue',
	admin_only: false,
	execute(message) {

		// Join the Queue
		async function joinQueue() {
			const queuePromise = await queue.findOrCreate({ where: { user_id: message.member.id }, defaults: { user_name: message.member.user.username } });

			if (queuePromise[1] == false) {
				message.reply('You are already in the Queue! :smile:');
			}
			else {
				message.reply('You have been added to the Queue! :smile:');

				const canMessage = await checkQuota('dm');
				const canMention = await checkQuota('mention');
				const queueCount = await queue.count();

				if (queueCount >= CONFIG.player_limit) {
					messageUsers(canMessage);
					messageChannel(canMention, queueCount);
				}
				else {
					messageChannel(canMention, queueCount);
				}
			}

			return true;
		}

		// Check to see if we can mention or dm a user (limited to once every 4 hours)
		async function checkQuota(messageType) {
			const t = new Date().getTime();
			const canMessage = await messageQuota.findOrCreate({ where: { message_type: messageType }, defaults: { time: t } });
			const lastTime = parseInt(canMessage[0].time) + (4 * 60 * 60 * 1000);

			if (canMessage[1] == false && t < lastTime) {
				return false;
			}

			return true;
		}

		// Direct message users that the queue is full
		async function messageUsers(canMessage) {
			if (!canMessage) {
				return false;
			}

			// Gather queue users to DM
			const users = await queue.findAll();
			users.forEach(member => {
				message.client.fetchUser(member.user_id)
					.then(user => {
						// Send DMs
						user.send(':timer: Queue is full! Let\'s game! :grin:');
					}).catch(console.error);
			});

			// Update DM Quota time
			const t = new Date().getTime();
			messageQuota.update({ time: t }, { where: { message_type: 'dm' } });

			return true;
		}

		// Message channel and announce queue is full
		async function messageChannel(canMention, queueCount) {
			const users = await queue.findAll();

			let queueMessage = '>>> **:timer: Queue :timer:\n\nTotal in queue: **';

			queueMessage += queueCount + '/' + CONFIG.player_limit + '\n\n';

			if (queueCount >= CONFIG.player_limit) {
				if (canMention) {
					queueMessage += '**@here** ';

					// Update Mention Quota time
					const t = new Date().getTime();
					messageQuota.update({ time: t }, { where: { message_type: 'mention' } });
				}
				queueMessage += '**Queue is full! Let\'s game! :grin:**\n\n';
			}

			if (queueCount == 0) {
				queueMessage += 'There is nobody in queue :cry:\n';
			}

			users.forEach(user => {
				queueMessage += user.user_name + '\n';
			});

			if (queueCount < CONFIG.player_limit) {
				queueMessage += '\n You can join the queue by typing: `!join`';
			}

			// Message Channel
			message.channel.send(queueMessage);

			return true;
		}

		// Exec Join Queue
		joinQueue();
	},
};
