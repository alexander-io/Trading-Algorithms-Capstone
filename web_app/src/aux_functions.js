var remove_all_svgs_elms = function() {
    for (var i = 0; i < list_of_currencies.length; i++) {
      d3.select("#"+list_of_currencies[i])
        .selectAll("*")
        .remove()
    }
  }

  function price_to_percent_change(price_array) {
    var percent_change_array = []
    for (let i = 0; i < price_array.length-1;i++) {
      percent_change_array.push(percent_change(price_array[i], price_array[i+1]))
    }
    let min = Math.abs(d3.min(percent_change_array))
    // shift values by min
    for (let i = 0; i < percent_change_array.length;i++) { percent_change_array[i] += min }
    return percent_change_array;
  }

  var percent_change = function(today_price, yesterday_price) {
    return ((today_price - yesterday_price)/yesterday_price)*100
  }

  var inverse_array = function(arr) {
    var arr_builder = []
    for (let i = arr.length-1; i >= 0;i--){arr_builder.push(arr[i])}
    return arr_builder
  }

  var price_array_to_reduced_price_array = function(price_array) {
    let min = d3.min(price_array)
    let max = d3.max(price_array)
    if (min == max) return price_array
    for (let x = 0; x < price_array.length; x++) {
      price_array[x] -= min
    }
    return price_array
  }
