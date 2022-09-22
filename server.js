const express = require('express')
const formatMessage = require('./utils/formatMessage')
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const PORT = process.env.PORT || 5000

app.use(express.static('public'))

io.on('connection', socket => {
  // join room
  socket.on('join-room', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)
    io.to(user.room).emit('info', `${user.username} Has Joined The Chat!`)
    // Send users and room info
    io.to(user.room).emit('room-users', getRoomUsers(user.room))
  })

  // new message
  socket.on('new-message', message => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, message))
  })

  // disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user) {
      io.to(user.room).emit('info', `${user.username} Has Left The Chat!`)
      // Send users and room info
      io.to(user.room).emit('room-users', getRoomUsers(user.room))
    }
  })
})

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
