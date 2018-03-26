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

app.get('/d3.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/d3/dist/d3.min.js')
})

app.get('/semantic.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/semantic-ui/dist/semantic.min.js')
})

app.get('/semantic.min.css', function(req, res) {
  res.sendFile(__dirname + '/node_modules/semantic-ui/dist/semantic.min.css')
})

app.get('/jquery.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js')
})
