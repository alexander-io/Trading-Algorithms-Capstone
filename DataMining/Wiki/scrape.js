//http://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user&start=2018-01-18&end=2018-01-18&pages=Bitcoin|Ethereum
//This is a link to the wikipedia page views for both Bitcoin and Ethereum. The data tag is "<td class="table-view--average">70,655</td>" and we would need to seperate out the Bitcoin and Ethereum values.
// If we have time we should expand this for Litecoin

// resource :
// https://www.npmjs.com/package/request#custom-http-headers
// https://wikimedia.org/api

let request = require('request') // include request npm package


/* this is a comment */
// this works for one line


/*
 * define a function x to fire off request to pageview count rest api
 * provide as parameters :
 * pagetitle, title of the wiki page (case sensitive)
 */

let x = function(pagetitle, date) {

  let startingyear, startingmonth, startingday
  let endingyear, endingmonth, endingday

  if (date) {
    date.startingyear ? startingyear = date.startingyear : console.log('no starting year provided')
    console.log('starting year : ' + startingyear)

    date.endingyear ? endingyear = date.endingyear : console.log('no ending year provided')

  }


  let req_url = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/' + pagetitle + '/daily/2015100100/2015103100'
  var options = {
    url : req_url,
    headers: {
      'User-Agent': 'request'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body)
    }
  }
  request(options, callback);
}
x('Bitcoin', {'startingyear' : '2017'})
