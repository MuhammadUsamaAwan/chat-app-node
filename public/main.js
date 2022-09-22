// dom elements
const chatBox = document.getElementById('chat-box')
const messageForm = document.getElementById('message-form')
const message = document.getElementById('message')
const heading = document.getElementById('heading')
const userList = document.getElementById('user-list')

// get username & room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

// join room
const socket = io()
socket.emit('join-room', { username, room })
heading.innerHTML = `Room: ${room}`

// info message
socket.on('room-users', users => {
  userList.replaceChildren()
  users.forEach(element => {
    const user = document.createElement('li')
    user.className = 'mb-1'
    user.innerText = element.username
    userList.append(user)
  })
})

// info message
socket.on('info', message => {
  const infoMessage = document.createElement('div')
  infoMessage.className = 'bg-secondary py-1 px-2 rounded text-center'
  infoMessage.innerHTML = `<div>${message}</div>`
  chatBox.append(infoMessage)
  chatBox.scrollTop = chatBox.scrollHeight
})

// submit form
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  if (message.value !== '') {
    socket.emit('new-message', message.value)
    message.value = ''
  }
})

// recieve message
socket.on('message', message => {
  const recieveMessage = document.createElement('div')
  recieveMessage.classList = `bg-secondary py-1 px-2 rounded ${
    message?.username === username ? 'text-end' : ''
  } }`
  recieveMessage.innerHTML = `<div class="text-info">${message?.username}<span class="text-light ms-1">${message?.time}</span></div><div>${message?.text}</div>`
  chatBox.append(recieveMessage)
  chatBox.scrollTop = chatBox.scrollHeight
})
