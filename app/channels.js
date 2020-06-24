'use strict';


// Get array of active voice channels based on bot-config
function getVoiceChannels(discordClient, watchedChannels) {

	const voiceChannels = [];
	const serverChannels = [];

	if (!watchedChannels.length) {
		console.error('No watched channels supplied to get VoiceChannels');
		return voiceChannels;
	}

	// Loop all servers
	discordClient.guilds.cache.forEach(guild => {

		// Loop all channels
		guild.channels.cache.forEach(channel => {
			serverChannels.push(channel);
		});

	});

	if (!serverChannels.length) {
		console.error('No server channels supplied to get VoiceChannels');
		return voiceChannels;
	}

	// Loop watched channels (see bot-config.json)
	watchedChannels.forEach(watchedChannel => {

		serverChannels.forEach(channel => {
			if (channel.type == 'voice' && channel.name == watchedChannel) {
				voiceChannels.push(channel);
			}
		});

	});

	return voiceChannels;
}

// Exports
module.exports = {
	getVoiceChannels,
};