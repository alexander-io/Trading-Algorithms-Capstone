
// define a function to start the  interval refresh cycle
var refresh_queue = new  Q(list_of_currencies)
var start_interval = function() {
  outer_interval = setInterval(function() {
    clearInterval(inner_interval)
    refresh_queue.supporting_array = list_of_currencies.slice()

    inner_interval = setInterval(function() {
      if (refresh_queue.empty()) {
        clearInterval(inner_interval)
      } else {
        let curr_elem = refresh_queue.dequeue()

        d3.select("#"+curr_elem)
            .selectAll("*")
            .remove()
        socket.emit('req assessment', {currency : curr_elem})
        if (state_of_buttons[curr_elem].price) {
          socket.emit('req price n periods k density', {currency : curr_elem, time_periods : state_of_time_periods.time_periods, minute_density : state_of_time_periods.minute_interval})
        } else if (state_of_buttons[curr_elem].ema) {
          socket.emit('req ema n periods', {currency : curr_elem, periods : initial_time_periods})
        } else if (state_of_buttons[curr_elem].sma) {
          socket.emit('req sma n periods', {currency : curr_elem, periods : initial_time_periods})
        } else if (state_of_buttons[curr_elem].wiki) {
          socket.emit('req wiki n periods', {currency : curr_elem, periods : initial_time_periods})
        }
        document.getElementById("dimmer_"+curr_elem).setAttribute("style", "visibility:visible;")
      }
    }, 200)
  }, 15000)
}
// set live update interval for toggle button click
  var inner_interval = null
  var outer_interval = null

  if ($('.ui.toggle').checkbox('is checked')) {
    start_interval()
  }

  $('.ui.toggle').checkbox({
    onChecked: function () {
      console.log('checked')
      start_interval()
    },
    onUnchecked: function () {
      console.log('unchecked')
      clearInterval(inner_interval)
      clearInterval(outer_interval)
    }
  });
