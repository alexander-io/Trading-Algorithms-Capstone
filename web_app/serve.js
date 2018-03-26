let app = require('express')()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
const port = 8080

io.on('connection', function() {

})

server.listen(port, function() {
  console.log('listening on port',)
})

app.get('/', function(req,  res) {
  res.sendFile(__dirname + '/views/index.html')
})
