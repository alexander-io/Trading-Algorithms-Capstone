var funx = require(__dirname + '/../db/db_functions.js')
let app = require('express')()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
const port = 8080



server.listen(port, function() {
  console.log('listening on port')
})

app.get('/', function(req,  res) {
  res.sendFile(__dirname + '/views/index.html')
})

io.on('connection', function(socket) {
  socket.on('req ema n periods', function(data) {
    funx.get_ema_cmarketcap_for_n_time_period_by_currency_title(data.currency, data.periods).then((resolution, rejection) => {
      // console.log(resolution)
      socket.emit('res ema n periods', {price_array: resolution})
    })
  })

  socket.on('req price n periods', function(data) {
    funx.get_array_n_most_recent_prices_cmarketcap_by_currency_title(data.currency, data.periods).then((resolution, rejection) => {
      // console.log(resolution)
      socket.emit('res price n periods', {price_array: resolution})
    })
  })
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

app.get('/d3.v4.min.js', function(req,  res) {
  res.sendFile(__dirname + '/src/d3.v4.min.js')
})
