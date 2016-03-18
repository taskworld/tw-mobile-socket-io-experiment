'use strict'
var app = require('express')()
var fs = require('fs');
var http = require('http')
var server  = http.createServer(app)
var io = require('socket.io')(server);

server.listen(9002)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//ROOM
io.on('connection', (socket) => {
  console.log('someone conecting')
  socket.on('disconnect', () => {
    console.log('user Disconnect')
  })
  socket.on('echo', (data) => {
    socket.emit('echo', data)
  })
})


//Channels
io.of('channels')
.on('connection', (socket) => {

  console.log('someone conecting to channels')

  socket.on('disconnect', () => {
    console.log('user Disconnect from channels')
  })

  socket.on('echo', (data) => {

    setTimeout(() => {
      const response = 'Channels:' + 'Hello World'
      socket.emit('echo', response)
    }, 1000)
  })
})


const _rooms = [ 'channel1', 'channel2' ]

//Channel
io.of('channel')
.on('connection', (socket) => {

  console.log('someone conecting to channel')

  socket.on('disconnect', () => {

    console.log('user Disconnect from channel')
  })

  socket.on('join', roomName => {
    console.log('Try to join ', roomName)
    socket.join(roomName)
  })

  socket.on('leave', roomName => {
    console.log('Try to leave ', roomName)
    socket.leave(roomName)
  })
})

setInterval(() => {

  for (var i = 0; i < _rooms.length; i++) {
    const room = _rooms[i]
    io.of('channel').to(room).emit('echo',room)
  }
}, 1000)

console.log('Mock Socket IO server start....')
