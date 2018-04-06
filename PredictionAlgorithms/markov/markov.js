var funx = require(__dirname + '/../../db/db_functions.js')
var currencies = require(__dirname + '/../../DataMining/scheduler/currencies.json')

/*
 * take a percent value and return it's range
 * where 1 -> 1/10th of a percent -> 0.001
 * where 10 -> 10/10th of a percent -> 0.01
 * @param decimal represented percentage, i.e., 0.03 -> 3%, pass in 0.03 as param
 * @return return the range of the percent, i -> 0.03; o -> '3 - 4'
 */
var calc_percent_change_range = function(percent_change) {
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
}

/*
 * calculate the percent change between two time periods
 * @param t0, the current or most recent time period
 * @param t1, the previous time period
 * @return percent change, decimal format : 0.03 -> 3%
 */
var calc_percent_change = function(t0, t1) {
  var increase = t0 - t1
  var percent_increase = increase/t1
  return percent_increase
}

/*
 * take in an array of sequential values, interpolate their percent change values
 * i.e., [12.1, 11, 10] -> [.1, .1] -> [10%, 10%]
 * where index 0 is most recent time period
 * where index n is time period furthest in past
 */
var make_percent_change_arr = function(arr) {
  var percent_change_arr = []
  for (let i = arr.length; i > 0; i--) {
    percent_change_arr[i-1] = calc_percent_change(arr[i-1], arr[i])
  }
  return percent_change_arr
}

/*
 * take list of state keys
 * i.e., state key -> i, 0 - 1
 * ex. i, 0 - 1
 * ex. i, 3 - 4
 * ex. d, 0 - 1
 * ex. d, 3 - 4
 * make a map of their coorelated frequencies in the list and return
 */
var make_state_frequency_map = function(list_of_state_keys) {
  var map_of_state_key_freq = {}
  for (let i = 0; i < list_of_state_keys.length;i++) {
    if (map_of_state_key_freq[list_of_state_keys[i]]) {
      map_of_state_key_freq[list_of_state_keys[i]] += 1
    } else {
      map_of_state_key_freq[list_of_state_keys[i]] = 1
    }
  }
  return map_of_state_key_freq
}


/*
 * take list of state keys
 * make a map of the states in the list mapped to the frequencies of the next sequential state
 * where i, 0 - 1 : { i, 0 - 2 : 5, i, 2 - 3 : 3} ...
 * ...suggests that in the list there were 5 occurences of 'i, 0 - 2' after 'i, 0 - 1' ...
 * ... AND 3 occurences of 'i, 2 - 3' also following 'i, 0 - 1'
 */
var make_state_next_state_occurance_frequency_map = function(list_of_state_keys) {
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
}

var get_most_recent_price_change_range = function(array_of_price_fluctuation_ranges) {
  let most_recent_range = array_of_price_fluctuation_ranges.slice(0,1)
  return most_recent_range[0]
}

var predict_price_for_next_time_period = function(currency, minutes_analyzed, time_interval) {
  return new Promise((resolve, reject) => {
    funx.get_array_n_most_recent_prices_cmarketcap_by_currency_title_skip_k_periods(currency, minutes_analyzed, time_interval).then((resolution, rejection) => {
      var percent_change_arr = make_percent_change_arr(resolution)
      var periods_analyzed = resolution.length
      percent_change_arr.pop()

      let list_of_state_keys = []
      for (let i = 0; i < percent_change_arr.length; i++) {

        let appendage = "-"
        if (percent_change_arr[i] < 0) appendage = "d"
        if (percent_change_arr[i] > 0) appendage = "i"

        let state_key = appendage + ", " + calc_percent_change_range(percent_change_arr[i])
        list_of_state_keys.push(state_key)
      }
      var most_recent_price_fluctuation = get_most_recent_price_change_range(list_of_state_keys)
      var next_state_occurance_frequency = make_state_next_state_occurance_frequency_map(list_of_state_keys)

      var max_val = 0
      var max = null
      var init_flag = true

      for (x in next_state_occurance_frequency[most_recent_price_fluctuation]) {
        max_val = next_state_occurance_frequency[most_recent_price_fluctuation][x]
        max = x
        break
      }

      for (x in next_state_occurance_frequency[most_recent_price_fluctuation]) {
        if (next_state_occurance_frequency[most_recent_price_fluctuation][x] > max_val) {
          max_val = next_state_occurance_frequency[most_recent_price_fluctuation][x]
          max = x
        }
      }

      // console.log(next_state_occurance_frequency)

      resolve ({
        currency : currency,
        most_recent_price_fluctuation : most_recent_price_fluctuation,
        predicted_price_change : max,
        periods_analyzed : periods_analyzed,
        time_intervals_minutes : time_interval,
        total_minutes_analyzed : periods_analyzed * time_interval,
        frequency_graph : next_state_occurance_frequency
      })
    })
  })
}

var main = () => {
  for (let i = 0; i < currencies.currencies.length; i++) {
    predict_price_for_next_time_period(currencies.currencies[i], 30000, 10).then((resolution, rejection) => {
      console.log(resolution)
    })
  }
}

main()
