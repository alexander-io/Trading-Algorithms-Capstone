var initial_time_periods = 256
  var socket = io.connect('http://localhost:8080');
  var list_of_currencies = null

  socket.on('currencies', function(data) {
    create_markup_structure(data)

    list_of_currencies = data.currencies.slice()

    // for all currencies, send initial request to server for price and assessment
    for (let i  = 0; i <  data.currencies.length; i++) {
      socket.emit('req price n periods', {currency : data.currencies[i], periods : initial_time_periods})
      socket.emit('req assessment', {currency : data.currencies[i]})
    }
  })
