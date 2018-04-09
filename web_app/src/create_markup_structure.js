class Q {
    constructor(arr) {
      this.supporting_array = arr
    }
    enqueue(x) {
      this.supporting_array.push(x)
    }
    dequeue() {
      return this.supporting_array.shift()
    }
    empty() {
      return this.supporting_array.length == 0
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
  function round(number, precision) {
    var shift = function (number, precision, reverseShift) {
      if (reverseShift) {
        precision = -precision;
      }
      numArray = ("" + number).split("e");
      return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, precision, false)), precision, true);
  }

  var state_of_buttons = {}

  let funx = {
    price : function(symbol) {
      socket.emit('req price n periods k density', {currency : symbol, time_periods : state_of_time_periods.time_periods, minute_density : state_of_time_periods.minute_interval})
    },
    ema : function(symbol) {
      socket.emit('req ema n periods', {currency : symbol, time_periods : state_of_time_periods.time_periods, minute_density : state_of_time_periods.minute_interval})
    },
    sma : function(symbol) {
      console.log(state_of_time_periods)
        socket.emit('req sma n periods', {
          currency : symbol,
          time_periods : state_of_time_periods.time_periods,
          minute_density : state_of_time_periods.minute_interval})
    },
    wiki : function(symbol) {
      socket.emit('req wiki n periods', {currency : symbol, time_periods : initial_time_periods})
    },
    markov : function(symbol) {
      socket.emit('req markov n periods', {
        currency : symbol,
        time_periods : state_of_time_periods.time_periods,
        minute_density : state_of_time_periods.minute_interval})
    }
  }

  var unix_ms_to_date_string = function(unix_time_ms) {
        let date = new Date(unix_time_ms)
        let month = date.getMonth()
        let day_of_month = date.getDate()
        let hours = date.getHours()
        let minutes = "0" + date.getMinutes()
        let seconds = "0" + date.getSeconds()
        let formattedTime = (month+1)+':'+day_of_month+'; '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime
  }

  var  create_markup_structure = function(data) {
    // make svgs for each currency
    var svg_root = document.getElementById('svg_root')
    for (let i  = 0; i <  data.currencies.length; i++) {
      let row = document.createElement('div')
      row.classList.add("row")
      row.setAttribute("currency", data.currencies[i])

      let three_wide_col = document.createElement('div')
      three_wide_col.classList = ['three wide column']


      var left_ui_icon_message = document.createElement('div')
      left_ui_icon_message.classList = ['ui icon message']
      left_ui_icon_message.setAttribute("style", "background-color : " + color_arr[0])


      var left_ui_icon_message_content = document.createElement('div')
      left_ui_icon_message_content.classList = ['content']

      var currency_id = document.createElement('h2')
      currency_id.setAttribute("currency", data.currencies[i])
      currency_id.classList = ["currency_id_root " + data.currencies[i]]
      currency_id.setAttribute("id", "currency_id_root_"+data.currencies[i])
      currency_id.setAttribute("style", "color:white;display:inline")

      var currency_symbol = document.createElement('h2')
      currency_symbol.setAttribute("currency", data.currencies[i])
      currency_symbol.classList = ["currency_symbol_root " + data.currencies[i]]
      currency_symbol.setAttribute("id", "currency_symbol_root_"+data.currencies[i])
      currency_symbol.setAttribute("style", "color:white;c")

      left_ui_icon_message_content.appendChild(currency_id)
      left_ui_icon_message_content.appendChild(currency_symbol)

      left_ui_icon_message.appendChild(left_ui_icon_message_content)
      three_wide_col.appendChild(left_ui_icon_message)

      let ten_wide_col = document.createElement('div')
      ten_wide_col.classList = ['ten wide column']

      let ui_align_container = document.createElement('div')
      ui_align_container.classList =  ['ui center aligned container']
      ui_align_container.setAttribute("style", "padding:0% 1% 1% 1%; width:100%;")

      let ui_segment_display = document.createElement('div')
      ui_segment_display.classList = ['ui segment display_seg']
      ui_segment_display.setAttribute("style", "width:100%;")
      ui_segment_display.setAttribute("currency", data.currencies[i])


      let ui_active_dimmer = document.createElement("div")
      ui_active_dimmer.classList = ['ui active inverted dimmer']
      // ui_active_dimmer.setAttribute("style", "visibility:hidden;")
      ui_active_dimmer.setAttribute("currency", data.currencies[i])
      ui_active_dimmer.setAttribute("id", "dimmer_"+data.currencies[i])

      let ui_loader = document.createElement('div')
      ui_loader.classList = ['ui loader']

      ui_active_dimmer.appendChild(ui_loader)

      ui_segment_display.appendChild(ui_active_dimmer)


      // ui_segment_display.removeChild(ui_active_dimmer)
      // <div class="ui active dimmer">
      //   <div class="ui loader"></div>
      // </div>

      let ui_four_top_attached_buttons = document.createElement('div')
      ui_four_top_attached_buttons.classList = ['ui five top attached buttons ctrl_buttons']
      ui_four_top_attached_buttons.setAttribute("currency", data.currencies[i])

      var ui_active_button_price = document.createElement('div')
      ui_active_button_price.classList = ['ui active button price_button ' + data.currencies[i]]
      ui_active_button_price.setAttribute("funx", "price")
      ui_active_button_price.appendChild(document.createTextNode("price"))

      var ui_button_ema = document.createElement('div')
      ui_button_ema.classList = ['ui button ema_button ' + data.currencies[i]]
      ui_button_ema.setAttribute("funx", "ema")
      ui_button_ema.appendChild(document.createTextNode("EMA"))

      var ui_button_sma = document.createElement('div')
      ui_button_sma.classList = ['ui button sma_button ' + data.currencies[i]]
      ui_button_sma.setAttribute("funx", "sma")
      ui_button_sma.appendChild(document.createTextNode("SMA"))

      var ui_button_wiki = document.createElement('div')
      ui_button_wiki.classList = ['ui button wiki_views_button ' + data.currencies[i]]
      ui_button_wiki.setAttribute("funx", "wiki")
      ui_button_wiki.appendChild(document.createTextNode("Wiki Views"))

      var ui_active_button_markov = document.createElement('div')
      ui_active_button_markov.classList = ['ui button markov_button ' + data.currencies[i]]
      ui_active_button_markov.setAttribute("funx", "markov")
      ui_active_button_markov.appendChild(document.createTextNode("markov"))

      ui_four_top_attached_buttons.appendChild(ui_active_button_price)
      ui_four_top_attached_buttons.appendChild(ui_button_ema)
      ui_four_top_attached_buttons.appendChild(ui_button_sma)
      ui_four_top_attached_buttons.appendChild(ui_button_wiki)
      ui_four_top_attached_buttons.appendChild(ui_active_button_markov)

      ui_segment_display.appendChild(ui_four_top_attached_buttons)

      let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.classList = ['display_svg']
      svg.setAttribute("height", "500")
      svg.setAttribute("style", "margin-top : 5px;")

      svg.setAttribute("currency", data.currencies[i])
      svg.setAttribute("id", data.currencies[i])

      ui_segment_display.appendChild(svg)
      ui_align_container.appendChild(ui_segment_display)
      ten_wide_col.appendChild(ui_align_container)

      let three_wide_col_second = document.createElement('div')
      three_wide_col_second.classList = ['three wide column']

      var ui_icon_message = document.createElement('div')
      ui_icon_message.classList = ['ui icon message']

      var ui_icon_message_content = document.createElement('div')
      ui_icon_message_content.classList = ['content']

      var ui_icon_message_content_icon = document.createElement('i')
      ui_icon_message_content_icon.classList = ['material-icons']
      var ui_icon_message_content_icon_text_node =  document.createTextNode("assessment")
      ui_icon_message_content_icon.appendChild(ui_icon_message_content_icon_text_node)


      // TEXT NODE START
      var rank = document.createElement('h6')
      rank.setAttribute("currency", data.currencies[i])
      rank.classList = ["rank_root " + data.currencies[i]]
      rank.setAttribute("id", "rank_root_"+data.currencies[i])

      var current_price_usd = document.createElement('h6')
      current_price_usd.setAttribute("currency", data.currencies[i])
      current_price_usd.classList = ["current_price_usd_root " + data.currencies[i]]
      current_price_usd.setAttribute("id", "current_price_usd_root_"+data.currencies[i])

      var current_price_btc = document.createElement('h6')
      current_price_btc.setAttribute("currency", data.currencies[i])
      current_price_btc.classList = ["current_price_btc_root " + data.currencies[i]]
      current_price_btc.setAttribute("id", "current_price_btc_root_"+data.currencies[i])

      var market_cap_usd = document.createElement('h6')
      market_cap_usd.setAttribute("currency", data.currencies[i])
      market_cap_usd.classList = ["market_cap_usd_root " + data.currencies[i]]
      market_cap_usd.setAttribute("id", "market_cap_usd_root_"+data.currencies[i])

      var twenty_four_hr_volume = document.createElement('h6')
      twenty_four_hr_volume.setAttribute("currency", data.currencies[i])
      twenty_four_hr_volume.classList = ["twenty_four_hr_volume_root " + data.currencies[i]]
      twenty_four_hr_volume.setAttribute("id", "twenty_four_hr_volume_root_"+data.currencies[i])

      var total_supply = document.createElement('h6')
      total_supply.setAttribute("currency", data.currencies[i])
      total_supply.classList = ["total_supply_root " + data.currencies[i]]
      total_supply.setAttribute("id", "total_supply_root_"+data.currencies[i])

      var percent_change_1_hr = document.createElement('h6')
      percent_change_1_hr.setAttribute("currency", data.currencies[i])
      percent_change_1_hr.classList = ["percent_change_1_hr_root " + data.currencies[i]]
      percent_change_1_hr.setAttribute("id", "percent_change_1_hr_root_"+data.currencies[i])

      var percent_change_24_hr = document.createElement('h6')
      percent_change_24_hr.setAttribute("currency", data.currencies[i])
      percent_change_24_hr.classList = ["percent_change_24_hr_root " + data.currencies[i]]
      percent_change_24_hr.setAttribute("id", "percent_change_24_hr_root_"+data.currencies[i])

      var percent_change_7_days = document.createElement('h6')
      percent_change_7_days.setAttribute("currency", data.currencies[i])
      percent_change_7_days.classList = ["percent_change_7_days_root " + data.currencies[i]]
      percent_change_7_days.setAttribute("id", "percent_change_7_days_root_"+data.currencies[i])

      var last_updated = document.createElement('h6')
      last_updated.setAttribute("currency", data.currencies[i])
      last_updated.classList = ["last_updated_root " + data.currencies[i]]
      last_updated.setAttribute("id", "last_updated_root_"+data.currencies[i])

      // TEXT NODE END
      ui_icon_message_content.appendChild(ui_icon_message_content_icon)
      ui_icon_message_content.appendChild(rank)
      ui_icon_message_content.appendChild(current_price_usd)
      ui_icon_message_content.appendChild(current_price_btc)
      ui_icon_message_content.appendChild(market_cap_usd)
      ui_icon_message_content.appendChild(twenty_four_hr_volume)
      ui_icon_message_content.appendChild(total_supply)
      ui_icon_message_content.appendChild(percent_change_1_hr)
      ui_icon_message_content.appendChild(percent_change_24_hr)
      ui_icon_message_content.appendChild(percent_change_7_days)
      ui_icon_message_content.appendChild(last_updated)

      ui_icon_message.appendChild(ui_icon_message_content)
      three_wide_col_second.appendChild(ui_icon_message)

      row.appendChild(three_wide_col)
      row.appendChild(ten_wide_col)
      row.appendChild(three_wide_col_second)

      svg_root.appendChild(row)
    }

    // set the width of  the  svg according to the width of the pusher
    var width_of_seg = document.getElementById('00_seg').getBoundingClientRect().width
    let display_svgs = document.getElementsByTagName('svg')

    // set the width of the svgs
    for (var i = 0; i < display_svgs.length; i++) { display_svgs[i].setAttribute("width", width_of_seg-20) }

    for (var i = 0; i < data.currencies.length; i++) {
      state_of_buttons[data.currencies[i]] = {
        'price' : true,
        'ema' : false,
        'sma' : false,
        'wiki' : false,
        'time_periods' : 200
      }
    }

    // select control buttons
    let ctrl_buttons = document.getElementsByClassName('ctrl_buttons')
    // for each set of buttons...
    for (let x = 0; x < ctrl_buttons.length;x++) {
      // for each button ...
      for (let i = 0; i < ctrl_buttons[x].childNodes.length; i++) {
        // add event listener to each button
        ctrl_buttons[x].childNodes[i].addEventListener('click', function() {

          var key = ctrl_buttons[x].getAttribute('currency')
          for (xxx in state_of_buttons[key]) { state_of_buttons[key][xxx] = false }
          state_of_buttons[key][this.getAttribute("funx")] = true

          for (let ii = 0; ii < ctrl_buttons[x].childNodes.length; ii++) { /* deactivate other  buttons */ ctrl_buttons[x].childNodes[ii].classList.remove('active') }
          this.classList.add('active') // activate this one
          // remove svg contents
          d3.select("#"+ctrl_buttons[x].getAttribute('currency'))
            .selectAll("*")
            .remove()
          // call function to emit request to  server for more data
          funx[this.getAttribute("funx")](ctrl_buttons[x].getAttribute('currency'))
          // display loader animation
          document.getElementById("dimmer_"+key).setAttribute("style", "visibility:visible;")

        })
      }
    }
  }
