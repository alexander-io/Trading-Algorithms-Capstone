let app = require('express')
let server = require('http').createServer(app)
let io = require('socket.io')(server)
io.on('connection', function() {

})

server.listen(8080)

app.get('/', function(socket)) {
  socket.emit('data', {data: 'hello world'})
  socket.on('other data', function(data) {
    console.log(data)
  })
}
