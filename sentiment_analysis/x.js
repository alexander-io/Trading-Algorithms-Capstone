/* required dependecy, Sentimental
 * https://github.com/thinkroth/Sentimental
 */

let analyze = require('Sentimental').analyze,
  positivity = require('Sentimental').positivity,
  negativity = require('Sentimental').negativity

let tweet_data_2017_jan_01_16 = require('./jan_2017_01_16_tweets.json')
// let jan_2017_15_31_tweets = require('./jan_2017_15_31_tweets.json')
// let feb_2017_01_15_tweets = require('./feb_2017_01_15_tweets.json')
// let feb_2017_16_28_tweets = require('./feb_2017_16_28_tweets.json')
// let feb_2017_15_tweets = require('./feb_2017_15_tweets.json')
// let feb_2017_28_tweets = require('./feb_2017_28_tweets.json')

let lst_of_text_nodes = []

let create_solvent = function(date, sentiment, volume) {
  return {
    date : date,
    sentiment : sentiment,
    volume : volume
  }
}

class Solvent {
  constructor (date, sentiment, volume) {
    this.date = date
    this.sentiment = sentiment
    this.volume = volume
  }
}

class TweetNode {
  constructor(date, sentiment) {
    this.date = date
    this.sentiment = sentiment
  }
}

// create a dictionary structure k:v, where the key is the date of the tweet
// ... and the value is a tuple structure { average_sentiment, total_sentiment, total_num_tweets }

let tupp = function(date, tuple) {
  return {
    average_sentiment : tuple.average_sentiment,
    total_sentiment : tuple.total_sentiment,
    total_num_tweets : tuple.total_num_tweets
  }
}

class Tupp {
  constructor(average_sentiment, total_sentiment, total_num_tweets) {
    this.average_sentiment = average_sentiment
    this.total_sentiment = total_sentiment
    this.total_num_tweets = total_num_tweets
  }
}

let nocuous = function(json_data) {
  let container = {}
  for (let x = 0; x < json_data.length; x++) {
    let tweet_node = new TweetNode(json_data[x].timestamp, analyze(json_data[x].text))
    let tweet_day = tweet_node.date.substring(0, 10)

    if (container[tweet_day]) {
      container[tweet_day].total_sentiment += tweet_node.sentiment.score
      container[tweet_day].total_num_tweets ++
      container[tweet_day].average_sentiment = container[tweet_day].total_sentiment/container[tweet_day].total_num_tweets
    } else if (!container[tweet_day]) {
      container[tweet_day] = new Tupp(tweet_node.sentiment.score, tweet_node.sentiment.score, 1)
    }
  }
  let num_days_analyzed = 0
  for (x in container) {
    num_days_analyzed++
    console.log(x + "," + container[x].average_sentiment + "," + container[x].total_num_tweets)
  }
  console.log('number of days analyzed : ' + num_days_analyzed)
}

// call nocuous
nocuous(tweet_data_2017_jan_01_16)

let main = function() {
  let max = 0
  let running_total = 0
  // for all elems in lst_of_text_nodes
  for (let x = 0; x < lst_of_text_nodes.length; x++) {
    // call analyze function, pass in the text node
    let result_obj = analyze(lst_of_text_nodes[x])
    // extract the score
    //I like you so much
    running_total += result_obj.score
    result_obj.score < max ? max = result_obj.score : null
    // console.log(result_obj);
    console.log(lst_of_text_nodes[x] + ' ::: ' +result_obj.score);

  }

  console.log('largest value :', max);
  console.log('average :', running_total/lst_of_text_nodes.length);
}


/*
{
  score: -3,
  comparative: -1,

  positive: {
    score: 0,
    comparative: 0,
    words: []
  },
  negative: {
    score: 3,
    comparative: 1,
    words: [ 'terrible' ]
  }
}
*/


// let tweet_scores = {
//   '10/7/2017' : 2.5,
//   '10/6/2017' : 2.5,
//   '10/5/2017' : 2.5,
//   '10/4/2017' : 2.5,
//   '10/3/2017' : 2.5,
//   '10/2/2017' : 2.5
// }
//
// console.log(tweet_scores)
