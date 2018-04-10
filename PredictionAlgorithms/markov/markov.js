var funx = require(__dirname + '/../../db/db_functions.js')
var currencies = require(__dirname + '/../../DataMining/scheduler/currencies.json')

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
    for (let i = 0; i <= 100; i++) {
      arr_of_percent_changes.push(i/1000)
    }
    percent_change = Math.abs(percent_change)
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
  get_most_recent_price_change_range : function(array_of_price_fluctuation_ranges) {
    let most_recent_range = array_of_price_fluctuation_ranges.slice(0,1)
    return most_recent_range[0]
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

      num_elems += frequency
      running_total += x*frequency

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

    var average_expected_price_fluctuation = (running_total/num_elems)

    return {
      max_arr : max_arr,
      average_expected_price_fluctuation : average_expected_price_fluctuation
    }
  },
  predict_price_for_next_time_period : function(currency, minutes_analyzed, time_interval) {
    return new Promise((resolve, reject) => {
      funx.get_array_n_most_recent_prices_cmarketcap_by_currency_title_skip_k_periods(currency, minutes_analyzed, time_interval).then((resolution, rejection) => {
        // generate array of price percent changes_
        var percent_change_arr = this.make_percent_change_arr(resolution)
        var periods_analyzed = resolution.length
        // console.log(percent_change_arr)
        // let n = array of prices length
        // length of percent_change_arr is n-1 because percent change is determined via interpolation between two time periods
        percent_change_arr.pop()


        var list_of_state_keys = this.make_list_of_state_keys(percent_change_arr)
        var most_recent_price_fluctuation = this.get_most_recent_price_change_range(list_of_state_keys)
        var next_state_occurance_frequency = this.make_state_next_state_occurance_frequency_map(list_of_state_keys)
        var max_arr_AND_average_expected_price_flux = this.determine_array_of_likely_next_state_AND_average_expected_price_fluctuation(next_state_occurance_frequency, most_recent_price_fluctuation)


        resolve ({
          currency : currency,
          most_recent_price_fluctuation : most_recent_price_fluctuation,
          most_likely_price_fluctuations_next_period : max_arr_AND_average_expected_price_flux.max_arr,
          periods_analyzed : periods_analyzed,
          time_intervals_minutes : time_interval,
          total_minutes_analyzed : periods_analyzed * time_interval,
          average_expected_price_fluctuation : max_arr_AND_average_expected_price_flux.average_expected_price_fluctuation,
          frequency_graph : next_state_occurance_frequency
        })
      })
    })
  }
}

var main = () => {

  var semaphore = 0
  let max_val = 0
  let max = 0

  for (let i = 0; i < currencies.currencies.length; i++) {
    module.exports.predict_price_for_next_time_period(currencies.currencies[i], 3000, 30).then((resolution, rejection) => {
      // console.log(resolution)
      // spin lock
      while(semaphore < 0) {
        if (semaphore >= 0) break
      }

      // START critical  section
      if (resolution.average_expected_price_fluctuation > max_val) {
        // console.log('\t\t\tcompare : ' + resolution.average_expected_price_fluctuation + ' > ' + max_val + ' -> true')
        max_val = resolution.average_expected_price_fluctuation
        max = resolution
      }

      // console.log(resolution.currency, ':',resolution.average_expected_price_fluctuation) // test print curr : expected change for testing
      // END critical  section

      semaphore++
      if (semaphore===10) {
        console.log(
          'currency', max.currency,
          '\nmost recent price flux : ', max.most_recent_price_fluctuation,
          '\nmost likely price flux : ', max.most_likely_price_fluctuations_next_period,
          '\nperiods analyzed : ', max.periods_analyzed,
          '\ntime interval minutes : ', max.time_intervals_minutes,
          '\ntotal minutes analyzed : ', max.total_minutes_analyzed,
          '\naverage expected price flux : ', max.average_expected_price_fluctuation,
          '\nfreq graph: ', max.frequency_graph

        )
      }
    })
  }
}

main()
