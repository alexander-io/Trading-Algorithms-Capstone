(function() {
  var db_funx = require(__dirname + '/../db/db_functions.js')

  module.exports = {
    calc_average_views_by_pagetitle : function(pagetitle) {
      db_funx.get_array_wiki_views_where_pagetitle(pagetitle).then((resolution, rejection) => {
        // console.log(resolution)
        let running_total = 0
        for (let x = 0; x < resolution.length;x++) {
          running_total += resolution[x].views
        }
        let average_views = running_total/resolution.length
        console.log('avg', average_views)
      })
    },
    calc_variance_views_by_pagetitle : function(pagetitle) {

      // Work out the Mean (the simple average of the numbers)
      // Then for each number: subtract the Mean and square the result (the squared difference).
      // Then work out the average of those squared differences. (Why Square?)

    }
  }

  // sandbox function testing
  module.exports.calc_average_views_by_pagetitle('Ethereum')

})()
