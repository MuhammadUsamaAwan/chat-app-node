const users = []

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room }

  users.push(user)

  return user
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id)
}

// User leaves chat
function userLeave(id) {
  const user = users.find(user => user.id === id)
  users = user.filter(user => user.id !== id)
  return user
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
