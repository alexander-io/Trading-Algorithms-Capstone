var funx = require(__dirname + '/../../db/db_functions.js')
var currencies = require(__dirname + '/../../DataMining/scheduler/currencies.json')
var request = require('request')
// var request = require(__dirname + '/../../DataMining/blockchain/node_modules/request/request.js')

module.exports = {
  /*
   * take a percent value and return it's range
   * where 1 -> 1/10th of a percent -> 0.001
   * where 10 -> 10/10th of a percent -> 0.01
   * @param decimal represented percentage, i.e., 0.03 -> 3%, pass in 0.03 as param
   * @return return the range of the percent, i -> 0.03; o -> '3 - 4'
   */
  calc_percent_change_range_bin : function(percent_change) {
    let arr_of_percent_changes = []
    for (let i = 0; i <= 100; i++) {
      arr_of_percent_changes.push(i/1000)
    }

    percent_change = Math.abs(percent_change)
    if (percent_change == 0) return "0 - 0"
    for (let i = 1; i < arr_of_percent_changes.length; i++) {
      if (percent_change < arr_of_percent_changes[i]) {
        return i-1 + " - " + i
      }
    }
  },
  calc_percent_change_range : function(percent_change) {
    let positive = percent_change > 0
    let arr_of_percent_changes = []
    for (let i = 0; i <= 1000; i++) {
      arr_of_percent_changes.push(i/1000)
    }
    percent_change = Math.abs(percent_change)
    // console.log(percent_change)
    if (percent_change == 0) return 0
    for (let i = 1; i < arr_of_percent_changes.length; i++) {
      if (percent_change < arr_of_percent_changes[i]) {
        // return i-1 + " - " + i
        if (positive) return i/1000
        else return (i/1000 )*-1
      }
    }
  },
  /*
   * calculate the percent change between two time periods
   * @param t0, the current or most recent time period
   * @param t1, the previous time period
   * @return percent change, decimal format : 0.03 -> 3%
   */
  calc_percent_change : function(t0, t1) {
    var increase = t0 - t1
    var percent_increase = increase/t1
    return percent_increase
  },
  /*
   * take in an array of sequential values, interpolate their percent change values
   * i.e., [12.1, 11, 10] -> [.1, .1] -> [10%, 10%]
   * where index 0 is most recent time period
   * where index n is time period furthest in past
   */
  make_percent_change_arr : function(arr) {
    var percent_change_arr = []
    for (let i = arr.length; i > 0; i--) {
      percent_change_arr[i-1] = this.calc_percent_change(arr[i-1], arr[i])
    }
    return percent_change_arr
  },
  /*
   * take list of state keys
   * i.e., state key -> i, 0 - 1
   * ex. i, 0 - 1
   * ex. i, 3 - 4
   * ex. d, 0 - 1
   * ex. d, 3 - 4
   * make a map of their coorelated frequencies in the list and return
   */
  make_state_frequency_map : function(list_of_state_keys) {
    // console.log(list_of_state_keys)
    var map_of_state_key_freq = {}
    for (let i = 0; i < list_of_state_keys.length;i++) {
      if (map_of_state_key_freq[list_of_state_keys[i]]) {
        map_of_state_key_freq[list_of_state_keys[i]] += 1
      } else {
        map_of_state_key_freq[list_of_state_keys[i]] = 1
      }
    }
    return map_of_state_key_freq
  },
  /*
   * take list of state keys
   * make a map of the states in the list mapped to the frequencies of the next sequential state
   * where i, 0 - 1 : { i, 0 - 2 : 5, i, 2 - 3 : 3} ...
   * ...suggests that in the list there were 5 occurences of 'i, 0 - 2' after 'i, 0 - 1' ...
   * ... AND 3 occurences of 'i, 2 - 3' also following 'i, 0 - 1'
   */
  make_state_next_state_occurance_frequency_map : function(list_of_state_keys) {
    // console.log(list_of_state_keys)
    var map_of_state_key_freq = {}
    for (let i = list_of_state_keys.length-1; i > 0;i--) {
      if (map_of_state_key_freq[list_of_state_keys[i]]) {
        if (map_of_state_key_freq[list_of_state_keys[i]][list_of_state_keys[i-1]]) {
          map_of_state_key_freq[list_of_state_keys[i]][list_of_state_keys[i-1]] += 1
        } else {
          map_of_state_key_freq[list_of_state_keys[i]][list_of_state_keys[i-1]] = 1
        }
      } else {
        map_of_state_key_freq[list_of_state_keys[i]] = {}
        map_of_state_key_freq[list_of_state_keys[i]][list_of_state_keys[i-1]] = 1
      }
    }
    delete map_of_state_key_freq.undefined
    return map_of_state_key_freq
  },
  make_n_state_next_state_occurance_frequency_map : function(list_of_state_keys, n_states) {
    var map_of_state_key_freq = {}
    var key_builder = ''

    for (let i = list_of_state_keys.length-1; i > n_states-2;i--) {
      key_builder = ''
      // build key
      for (let j = i; j > i - n_states; j--) {
        if (key_builder.length === 0) {
          key_builder += list_of_state_keys[j]
        } else {
          key_builder += '->'+list_of_state_keys[j]
        }
      }
      // console.log(key_builder)

      if (map_of_state_key_freq[key_builder]) {
        if (map_of_state_key_freq[key_builder][list_of_state_keys[i-n_states]]) {
          map_of_state_key_freq[key_builder][list_of_state_keys[i-n_states]] += 1
        } else {
          map_of_state_key_freq[key_builder][list_of_state_keys[i-n_states]] = 1
        }
      } else {
        map_of_state_key_freq[key_builder] = {}
        map_of_state_key_freq[key_builder][list_of_state_keys[i-n_states]] = 1
      }
    }


    delete map_of_state_key_freq.undefined
    return map_of_state_key_freq
  },
  get_most_recent_price_change_range : function(array_of_price_fluctuation_ranges) {
    let most_recent_range = array_of_price_fluctuation_ranges.slice(0,1)
    return most_recent_range[0]
  },
  get_double_most_recent_price_change_range : function(array_of_price_fluctuation_ranges) {
    let most_recent_range = array_of_price_fluctuation_ranges.slice(0,2)

    return most_recent_range[1]+'->'+most_recent_range[0]
  },
  get_n_most_recent_price_change_range : function(array_of_price_fluctuation_ranges, num_states) {
    let most_recent_range = array_of_price_fluctuation_ranges.slice(0, num_states)
    let builder = most_recent_range[most_recent_range.length-1]
    for (let i = most_recent_range.length-2; i >= 0; i--) {
      builder += '->' + most_recent_range[i]
    }
    return builder
  },

  /*
   * make a list of state keys based on the percent  changes
   * i.e., percent_changes = [0.01, -0.02, 0.03]
   *... then  list_of_state_keys = ['i, 0 - 1', 'd, 1 - 2', 'i, 1 - 3']
   */
  make_list_of_state_keys : function(percent_change_arr) {
    let list_of_state_keys = []
    for (let i = 0; i < percent_change_arr.length; i++) {
      let state_key = this.calc_percent_change_range(percent_change_arr[i])
      list_of_state_keys.push(state_key)
    }
    return list_of_state_keys
  },
  determine_array_of_likely_next_state_AND_average_expected_price_fluctuation :  function(next_state_occurance_frequency, most_recent_price_fluctuation) {
    var max_val = 0
    var max = null
    var max_arr = []
    // XXX test print
    // console.log('recent', most_recent_price_fluctuation)
    // console.log('freq', next_state_occurance_frequency)
    // console.log('freq->recent', next_state_occurance_frequency[most_recent_price_fluctuation])
    // console.log(next_state_occurance_frequency, most_recent_price_fluctuation)
    // initialize the max value to be any object in map
    for (x in next_state_occurance_frequency[most_recent_price_fluctuation]) {
      max_val = next_state_occurance_frequency[most_recent_price_fluctuation][x]
      max = x
      break
    }

    var running_total = 0
    var num_elems = 0
    // iterate through entire map, update max value if necessary
    for (x in next_state_occurance_frequency[most_recent_price_fluctuation]) {
      let frequency = next_state_occurance_frequency[most_recent_price_fluctuation][x]

      if (x !== 'undefined') {
        num_elems += frequency
        running_total += x*frequency
      }

      /*
       * the possibility exists that a tie will occur when comparing the frequency of the next state  possibilities
       * ex., if state a -> b occured 5 times...
       * ... and if state a -> c occured five times...
       * if  it is currently state a, what is the most likely state?
       * well, state b and state c tied in occurances/frequency
       * therefore, the following logic handles tie-breakers for likely next state occurances
       * build an array, max_arr filled with the state transitions that equally likely i.e., tied in frequency
       */
      if (next_state_occurance_frequency[most_recent_price_fluctuation][x] > max_val) {
        max_arr = []
        max_val = next_state_occurance_frequency[most_recent_price_fluctuation][x]
        max = x
        max_arr.push(max)
      } else if (next_state_occurance_frequency[most_recent_price_fluctuation][x] === max_val) {
        max_arr.push(x)
      }
    }

    return {
      max_arr : max_arr,
      average_expected_price_fluctuation : running_total/num_elems
    }
  },
  predict_price_for_next_time_period : function(currency, time_periods, minute_interval, num_states) {
    return new Promise((resolve, reject) => {
      funx.get_array_n_most_recent_prices_cmarketcap_by_currency_title_skip_k_periods(currency, time_periods, minute_interval).then((resolution, rejection) => {
        // generate array of price percent changes_
        var percent_change_arr = this.make_percent_change_arr(resolution)
        var periods_analyzed = resolution.length
        // let n = array of prices length
        // length of percent_change_arr is n-1 because percent change is determined via interpolation between two time periods
        percent_change_arr.pop()

        var list_of_state_keys = this.make_list_of_state_keys(percent_change_arr)

        var most_recent_price_fluctuation = this.get_n_most_recent_price_change_range(list_of_state_keys, num_states)

        var next_state_occurance_frequency = this.make_n_state_next_state_occurance_frequency_map(list_of_state_keys, num_states)

        var max_arr_AND_average_expected_price_flux = this.determine_array_of_likely_next_state_AND_average_expected_price_fluctuation(next_state_occurance_frequency, most_recent_price_fluctuation)

        resolve ({
          currency : currency,
          most_recent_price_fluctuation : most_recent_price_fluctuation,
          most_likely_price_fluctuations_next_period : max_arr_AND_average_expected_price_flux.max_arr,
          periods_analyzed : periods_analyzed,
          time_intervals_minutes : minute_interval,
          total_minutes_analyzed : periods_analyzed * minute_interval,
          average_expected_price_fluctuation : max_arr_AND_average_expected_price_flux.average_expected_price_fluctuation,
          frequency_graph : next_state_occurance_frequency
        })
      })
    })
  },
  determine_currency_with_highest_expected_average_price_change : function(list_of_currencies, time_periods, minute_interval, num_states) {
    return new Promise((resolve, reject) => {
      var semaphore = 0
      let max_val = 0
      let max = 0

      for (let i = 0; i < list_of_currencies.length; i++) {
        module.exports.predict_price_for_next_time_period(list_of_currencies[i], time_periods, minute_interval, num_states).then((resolution, rejection) => {


          if (rejection) reject(rejection)

          // spin lock
          while(semaphore < 0) {
            if (semaphore >= 0) break
          }

          // START critical  section
          if (resolution.average_expected_price_fluctuation > max_val) {
            max_val = resolution.average_expected_price_fluctuation
            max = resolution
          }
          // END critical  section

          semaphore++
          if (semaphore===10) {
            resolve ({
              'currency' : max.currency,
              'most_recent_price_fluctuation' : max.most_recent_price_fluctuation,
              'most_likely_price_fluctuations_next_period' : max.most_likely_price_fluctuations_next_period,
              'periods_analyzed' : max.periods_analyzed,
              'time_intervals_minutes' : max.time_intervals_minutes,
              'total_minutes_analyzed' : max.total_minutes_analyzed,
              'average_expected_price_flux' : max.average_expected_price_fluctuation,
              'freq_graph' : max.frequency_graph
            })
          }
        })
      }
    })
  },
  get_current_price : function(currency) {
    var req_url = 'https://api.coinmarketcap.com/v1/ticker/'

    var options =  {
      url : req_url,
      headers : {
        'User-Agent' : 'request'
      }
    }

    var price_now = null

    return new Promise((resolve, reject) => {
      var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body)
          for (var x = 0; x < info.length;x++) {
            if (info[x].symbol === currency) {
              console.log(info[x])
              price_now = parseFloat(info[x].price_usd)
              resolve ({price : price_now})

            }
          }
        }
      }
      request(options, callback)
    })
  }
}

var main = () => {
  let currency, time_periods, skip_periods, num_states

  if (process.argv[2] && currencies.currencies.includes(process.argv[2]) || process.argv[2] && process.argv[2] === 'top') {
    currency = process.argv[2]
  } else {
    currency = 'all'
  }
  process.argv[3] ? time_periods = parseInt(process.argv[3]) : time_periods = 100
  process.argv[4] ? skip_periods = parseInt(process.argv[4]) : skip_periods = 1
  process.argv[5] ? num_states = parseInt(process.argv[5]) : num_states = 1

  console.log('num states ::', num_states)

  if (currency === 'all') {
    for (let i = 0; i < currencies.currencies.length;i++) {
      module.exports.predict_price_for_next_time_period(currencies.currencies[i], time_periods, skip_periods, num_states).then((resolution, rejection) => {
        console.log(resolution)
      })
    }
  } else if (currency === 'top') {
    module.exports.determine_currency_with_highest_expected_average_price_change(currencies.currencies, time_periods, skip_periods, num_states).then((resolution, rejection) => {
      console.log(resolution)
    })
  } else {
    module.exports.predict_price_for_next_time_period(currency, time_periods, skip_periods, num_states).then((resolution, rejection) => {
      console.log(resolution)
    })
  }
}

main()
