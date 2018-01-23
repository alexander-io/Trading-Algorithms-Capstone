import re, tweepy, datetime, time, csv
from tweepy import OAuthHandler
from textblob import TextBlob
 
class TwitterClient(object):
    '''
    Generic Twitter Class for sentiment analysis.
    '''
    def __init__(self):
        '''
        Class constructor or initialization method.
        '''
        # keys and tokens from the Twitter Dev Console
    #Bitcoin
        consumer_keyBTC = '9rVL33CxgKO1X5JPZGYL3qYHP'
        consumer_secretBTC = 'WSuYRW6WuF3GFxYcPGYr8gLuOwPupCT9biBB7zuB9tlaf450EN'
        access_tokenBTC = '922587032051785728-N1OaYlpJZPiGwQYmL0HhFr48o0JcOnx'
        access_token_secretBTC = 'dNMOjZTWcbJEnURMR20Bx6S868fdjOwDApNCPKs3GfYqX'
    
    #Ethereum
        consumer_keyETH = 'VxpSOPCrAtFmLEUAtTDy6OMXv'
        consumer_secretETH = 'HBq7Xwk1mgd4ucJvOjNg8Uy8PlHvQxM4Rou1Jp14qjWp1x0zES'
        access_tokenETH = '922587032051785728-5QNeEWEQYSKjmO6yhvfrzf2SHgDbMDe'
        access_token_secretETH = 'AjumQM60tusYsUEz79FmK5lrqnhSWCTO4yUTOGX0J2Ou1'

    #Litecoin
        consumer_keyLTC = 'GC13PStya8Ntoism1pss8bwM3'
        consumer_secretLTC = 'tM9gmmjD4AJOHtEiqbWak4E17vnXC565v5A5RBpfm1v73wClOT'
        access_tokenLTC = '922587032051785728-CqvqxAVNycalkb7FktCbNLf9VZlCocO'
        access_token_secretLTC = 'TG4svsI4HLQqUNR4mPmzTjJsmgPMgq8l42JgNvpKPgJhR'


        # attempt authentication
        try:
        #Bitcoin
            # create OAuthHandler object
            self.authBTC = OAuthHandler(consumer_keyBTC, consumer_secretBTC)
            # set access token and secret
            self.authBTC.set_access_token(access_tokenBTC, access_token_secretBTC)
            # create tweepy API object to fetch tweets
            self.apiBTC = tweepy.API(self.authBTC)
            #data = self.api.rate_limit_status()
        #Ethereum
            # create OAuthHandler object
            self.authETH = OAuthHandler(consumer_keyETH, consumer_secretETH)
            # set access token and secret
            self.authETH.set_access_token(access_tokenETH, access_token_secretETH)
            # create tweepy API object to fetch tweets
            self.apiETH = tweepy.API(self.authETH)
            #data = self.api.rate_limit_status()
        #Litecoin
            # create OAuthHandler object
            self.authLTC = OAuthHandler(consumer_keyLTC, consumer_secretLTC)
            # set access token and secret
            self.authLTC.set_access_token(access_tokenLTC, access_token_secretLTC)
            # create tweepy API object to fetch tweets
            self.apiLTC = tweepy.API(self.authLTC)
            #data = self.api.rate_limit_status()
            
        except:
            print("Error: Authentication Failed")
 
    def clean_tweet(self, tweet):
        '''
        Utility function to clean tweet text by removing links, special characters
        using simple regex statements.
        '''
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())
 
    def get_tweet_sentiment(self, tweet):
        '''
        Utility function to classify sentiment of passed tweet
        using textblob's sentiment method
        '''
        # create TextBlob object of passed tweet text
        analysis = TextBlob(self.clean_tweet(tweet))
        # set sentiment
        if analysis.sentiment.polarity > 0:
            return 'positive'
        elif analysis.sentiment.polarity == 0:
            return 'neutral'
        else:
            return 'negative'
 
    def get_tweets(self, query, count, page, start, end):
        '''
        Main function to fetch tweets and parse them.
        '''
        # empty list to store parsed tweets
        tweets = []
 
        try:
            # call twitter api to fetch tweets
            if query=='Bitcoin':
                fetched_tweets = tweepy.Cursor(self.apiBTC.search, q=query, until=end, lang="en").items(count)
            elif query=='Ethereum':
                fetched_tweets = tweepy.Cursor(self.apiETH.search, q=query, until=end, lang="en").items(count)
            else:
                fetched_tweets = tweepy.Cursor(self.apiLTC.search, q=query, until=end, lang="en").items(count)

            for tweet in fetched_tweets:
            #print(fetched_tweets)
            # parsing tweets one by one
            #for tweet in fetched_tweets:
                # empty dictionary to store required params of a tweet
                parsed_tweet = {}
 
                # saving text of tweet
                #parsed_tweet['text'] = tweet.text
                # saving sentiment of tweet
                parsed_tweet['sentiment'] = self.get_tweet_sentiment(tweet.text)
 
                # appending parsed tweet to tweets list
                if tweet.retweet_count > 0:
                    # if tweet has retweets, ensure that it is appended only once
                    if parsed_tweet not in tweets:
                        tweets.append(parsed_tweet)
                else:
                    tweets.append(parsed_tweet)
 
            # return parsed tweets
            return tweets
 
        except tweepy.TweepError as e:
            # print error (if any)
            print("Error : " + str(e))

    def writeToCSV_BTC(self):
        with open('TwitterSentimentBTC.csv', 'a', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            # calling function to get tweets
            tweets = self.get_tweets(query = 'Bitcoin',count=1000, page = 1, start=datetime.date.today()-datetime.timedelta(days=31), end=datetime.date.today())

            if tweets==None:
                print('No Tweets')
            # picking positive tweets from tweets
            else:
                ptweets = [tweet for tweet in tweets if tweet['sentiment'] == 'positive']
                positivePercent = 100*len(ptweets)/len(tweets)
            # percentage of positive tweets
                #print("Positive tweets percentage:",positivePercent," %")
            # picking negative tweets from tweets
                ntweets = [tweet for tweet in tweets if tweet['sentiment'] == 'negative']
                negativePercent = 100*len(ntweets)/len(tweets)
            # percentage of negative tweets
                #print("Negative tweets percentage: ",negativePercent," %")

                nuetralPercent = 100*(len(tweets) - (len(ntweets) + len(ptweets)))/len(tweets)
            #print(nuetral)
            # percentage of neutral tweets
                #print("Neutral tweets percentage:",nuetralPercent,"%")
                csvValue = [datetime.datetime.now(),positivePercent,negativePercent,nuetralPercent]
                csvWriter.writerow(csvValue)
        csvfile.close()


    def writeToCSV_LTC(self):
        with open('TwitterSentimentLTC.csv', 'a', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            # calling function to get tweets
            tweets = self.get_tweets(query = 'Litecoin',count=1000, page = 1, start=datetime.date.today()-datetime.timedelta(days=31), end=datetime.date.today())

            if tweets==None:
                print('No Tweets')
            # picking positive tweets from tweets
            else:
                ptweets = [tweet for tweet in tweets if tweet['sentiment'] == 'positive']
                positivePercent = 100*len(ptweets)/len(tweets)
            # percentage of positive tweets
                #print("Positive tweets percentage:",positivePercent," %")
            # picking negative tweets from tweets
                ntweets = [tweet for tweet in tweets if tweet['sentiment'] == 'negative']
                negativePercent = 100*len(ntweets)/len(tweets)
            # percentage of negative tweets
                #print("Negative tweets percentage: ",negativePercent," %")

                nuetralPercent = 100*(len(tweets) - (len(ntweets) + len(ptweets)))/len(tweets)
            #print(nuetral)
            # percentage of neutral tweets
                #print("Neutral tweets percentage:",nuetralPercent,"%")
                csvValue = [datetime.datetime.now(),positivePercent,negativePercent,nuetralPercent]
                csvWriter.writerow(csvValue)
        csvfile.close()



    def writeToCSV_ETH(self):
        with open('TwitterSentimentETH.csv', 'a', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            # calling function to get tweets
            tweets = self.get_tweets(query = 'Ethereum',count=1000, page = 1, start=datetime.date.today()-datetime.timedelta(days=31), end=datetime.date.today())

            if tweets==None:
                print('No Tweets')
            # picking positive tweets from tweets
            else:
                ptweets = [tweet for tweet in tweets if tweet['sentiment'] == 'positive']
                positivePercent = 100*len(ptweets)/len(tweets)
            # percentage of positive tweets
                #print("Positive tweets percentage:",positivePercent," %")
            # picking negative tweets from tweets
                ntweets = [tweet for tweet in tweets if tweet['sentiment'] == 'negative']
                negativePercent = 100*len(ntweets)/len(tweets)
            # percentage of negative tweets
                #print("Negative tweets percentage: ",negativePercent," %")

                nuetralPercent = 100*(len(tweets) - (len(ntweets) + len(ptweets)))/len(tweets)
            #print(nuetral)
            # percentage of neutral tweets
                #print("Neutral tweets percentage:",nuetralPercent,"%")
                csvValue = [datetime.datetime.now(),positivePercent,negativePercent,nuetralPercent]
                csvWriter.writerow(csvValue)
        csvfile.close()

 
def main():
    # creating object of TwitterClient Class
    api = TwitterClient()
    while True:
        api.writeToCSV_BTC()
        api.writeToCSV_ETH()
        api.writeToCSV_LTC()
        time.sleep(900)#fifteen minutes
    #check to see if throttled
    #data = api.rate_limit_status()
    #print(data)
    


        
 
    # printing first 5 positive tweets
    #print("\n\nPositive tweets:")
    #for tweet in ptweets[:10]:
    #    print(tweet['text'])
 
    # printing first 5 negative tweets
    #print("\n\nNegative tweets:")
    #for tweet in ntweets[:10]:
    #    print(tweet['text'])
 
if __name__ == "__main__":
    # calling main function
    main()

