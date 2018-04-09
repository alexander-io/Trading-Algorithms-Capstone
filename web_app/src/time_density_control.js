var state_of_time_periods = {
      minute_interval : 1,
      time_periods : 256
}

var minute_options = document.getElementsByClassName('minute_option')
var period_options = document.getElementsByClassName('period-option')
for (var i = 0; i < minute_options.length; i++) {
  minute_options[i].addEventListener('mouseover', function() {
    this.setAttribute("style", "background:#bd9e39!important;")
  })
  minute_options[i].addEventListener('mouseout', function() {
    if (!this.classList.contains('active')) {
      this.setAttribute("style", "background:white!important;")
    }
  })

  // click
  minute_options[i].addEventListener('click', function() {
    remove_all_svgs_elms()
    for (var ii = 0; ii < minute_options.length; ii++) {
      minute_options[ii].classList.remove('active')
      minute_options[ii].setAttribute("style", "background:white!important;")
    }
    this.classList.add('active')
    this.setAttribute("style", "background:#bd9e39!important;")
    state_of_time_periods.minute_interval = parseInt(this.getAttribute("value"))

    for (var ii = 0; ii < list_of_currencies.length; ii++) {
      // console.log(list_of_currencies[ii])

      socket.emit('req price n periods k density', {currency : list_of_currencies[ii], time_periods : state_of_time_periods.time_periods, minute_density : state_of_time_periods.minute_interval})
      document.getElementById("dimmer_"+list_of_currencies[ii]).setAttribute("style", "visibility:visible;")
    }
    console.log(list_of_currencies)
    console.log(state_of_time_periods)
  })
}

for (var i = 0; i < period_options.length; i++) {
  period_options[i].addEventListener('mouseover', function() {
    this.setAttribute("style", "background:#bd9e39!important;")
  })

  period_options[i].addEventListener('mouseout', function() {
    if (!this.classList.contains('active')) {
      this.setAttribute("style", "background:white!important;")
    }
  })

  // click
  period_options[i].addEventListener('click', function() {
    remove_all_svgs_elms()
    for (var ii = 0; ii < period_options.length; ii++) {
      period_options[ii].classList.remove('active')
      period_options[ii].setAttribute("style", "background:white!important;")
    }
    this.classList.add('active')
    this.setAttribute("style", "background:#bd9e39!important;")
    state_of_time_periods.time_periods = parseInt(this.getAttribute("value"))
    for (var ii = 0; ii < list_of_currencies.length; ii++) {
      console.log(list_of_currencies[ii])
      socket.emit('req price n periods k density', {currency : list_of_currencies[ii], time_periods : state_of_time_periods.time_periods, minute_density : state_of_time_periods.minute_interval})
      document.getElementById("dimmer_"+list_of_currencies[ii]).setAttribute("style", "visibility:visible;")
    }
  })
}
