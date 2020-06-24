'use strict';


// Get array of user ids + user names in active voice channels
function getActiveUsers(channels) {

	const activeUsers = [];

	if (!channels.length) {
		console.error('No channels supplied to getActiveUsers');
		return activeUsers;
	}

	channels.forEach(channel => {
		channel.members.forEach(member => {
			activeUsers.push([member.user.id, member.user.username]);
		});
	});

	return activeUsers;
}

// Get array of member objects in active voice channels
function getActiveMembers(channels) {

	const activeUsers = [];

	if (!channels.length) {
		console.error('No channels supplied to getActiveUsers');
		return activeUsers;
	}

	channels.forEach(channel => {
		channel.members.forEach(member => {
			activeUsers.push(member);
		});
	});

	return activeUsers;
}

// Exports
module.exports = {
	getActiveUsers,
	getActiveMembers,
};