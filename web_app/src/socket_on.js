
var color_arr = [/*d3.schemeCategory20b[8], */d3.schemeCategory20b[9], d3.schemeCategory20b[10], d3.schemeCategory20b[11]]
console.log(color_arr)

socket.on('res price n periods', function(price_data){
  res_price_n_periods(price_data, price_data.price_array.length)
})

socket.on('res ema n periods', function(price_data) {
  res_price_n_periods(price_data, price_data.price_array.length)
})

socket.on('res sma n periods', function(price_data) {
  res_price_n_periods(price_data, price_data.price_array.length)
})

// handle assesement response from server, select elements and bind data from server to them
socket.on('res assessment', function(data) {

  document.getElementById('currency_id_root_'+data.price_assessment.symbol).innerHTML = "<b> </b>" + data.price_assessment.id

  document.getElementById('currency_symbol_root_'+data.price_assessment.symbol).innerHTML = "<b> </b>" + data.price_assessment.symbol


  document.getElementById('rank_root_'+data.price_assessment.symbol).innerHTML = "<b>rank : </b>" + data.price_assessment.rank

  document.getElementById('current_price_usd_root_'+data.price_assessment.symbol).innerHTML = "<b>$/usd : </b>" + data.price_assessment.price_usd

  document.getElementById('current_price_btc_root_'+data.price_assessment.symbol).innerHTML = "<b>$/btc : </b>" + data.price_assessment.price_btc

  document.getElementById('market_cap_usd_root_'+data.price_assessment.symbol).innerHTML = "<b>marketcap usd : </b>" + data.price_assessment.market_cap_usd

  document.getElementById('twenty_four_hr_volume_root_'+data.price_assessment.symbol).innerHTML = "<b>24hr vol. : </b>" + data.price_assessment['24h_volume_usd']

  document.getElementById('total_supply_root_'+data.price_assessment.symbol).innerHTML = "<b>total supply : </b>" + data.price_assessment.total_supply

  document.getElementById('percent_change_1_hr_root_'+data.price_assessment.symbol).innerHTML = "<b>%change 1hr : </b>" + data.price_assessment.percent_change_1h

  document.getElementById('percent_change_24_hr_root_'+data.price_assessment.symbol).innerHTML = "<b>%change 24hr : </b>" + data.price_assessment.percent_change_24h

  document.getElementById('percent_change_7_days_root_'+data.price_assessment.symbol).innerHTML = "<b>%change 7d : </b>" + data.price_assessment.percent_change_7d

  document.getElementById('last_updated_root_'+data.price_assessment.symbol).innerHTML = "<b>updated : </b>" + unix_ms_to_date_string(data.price_assessment.unix_time)
})

socket.on('res wiki n periods', function(data) {
  console.log('got response from server', data)
  res_price_n_periods(data, data.price_array.length)
})

socket.on('res price n periods k density', function(data) {
  res_price_n_periods(data, data.price_array.length)
})
