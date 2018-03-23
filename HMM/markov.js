(function() {

  let gaussian = require(__dirname + '/gaussian.js')

  var db_funx = require(__dirname + '/../db/db_functions.js')

  module.exports = {
    calc_average_views_by_pagetitle : function(pagetitle) {
      return new Promise((resolve, reject) => {
        db_funx.get_array_wiki_views_where_pagetitle(pagetitle).then((resolution, rejection) => {
          if (rejection) reject(rejection)
          let running_total = 0
          for (let x = 0; x < resolution.length;x++) {
            running_total += resolution[x].views
          }
          let average_views = running_total/resolution.length
          resolve(average_views)
        })
      })
    },
    calc_variance_views_by_pagetitle : function(pagetitle) {
      return new Promise((resolve, reject) => {
        db_funx.get_array_wiki_views_where_pagetitle(pagetitle).then((resolution, rejection) => {
          if (rejection) reject(rejection)
          // Work out the Mean (the simple average of the numbers)
          let running_total = 0
          for (let x = 0; x < resolution.length;x++) {
            running_total += resolution[x].views
          }
          let average_views = running_total/resolution.length

          let array_of_squared_differences = []
          for (let x = 0;  x <  resolution.length; x++) {
            array_of_squared_differences.push(Math.pow(resolution[x].views - average_views, 2))
          }

          // sd -> squared differences
          let sd_running_total = 0
          for (let  x = 0; x < array_of_squared_differences.length;x++) {
            sd_running_total += array_of_squared_differences[x]
          }
          let variance = sd_running_total/array_of_squared_differences.length
          resolve(variance)
        })
      })
    },
    calc_normal_distribution_views_by_pagetitle : function(pagetitle) {
      return new Promise((resolve, reject) => {
        db_funx.get_array_wiki_views_where_pagetitle(pagetitle).then((array_resolution, rejection) => {
          if (rejection) reject(rejection)
          this.calc_variance_views_by_pagetitle(pagetitle).then((variance_resolution, variance_rejection) => {
            this.calc_average_views_by_pagetitle(pagetitle).then((average_resolution, average_rejection) => {
              let distribution = gaussian(average_resolution, variance_resolution)
              resolve(distribution)
            })
          })
        })
      })
    }
  }

  // sandbox function testing
  // module.exports.calc_average_views_by_pagetitle('Ethereum')
  // module.exports.calc_variance_views_by_pagetitle('Ethereum')
  module.exports.calc_normal_distribution_views_by_pagetitle('Ethereum')
  // module.exports.calc_normal_distribution_views_by_pagetitle('Ethereum')

})()
