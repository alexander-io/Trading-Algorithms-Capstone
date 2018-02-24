import requests, datetime, time, csv, re, ast

#ret = json.load(urllib2.urlopen(r"https://api.gdax.com/products/BTC-EUR/candles?start=2017-08-16T12:00:00&end=2017-08-16T13:00:00&granularity=600"))
class GdaxCandleGen():

    def runAllDefault():
        print("shortETH")
        GdaxCandleGen.ShortCandleGenETH(datetime.date.today(),datetime.timedelta(minutes=15))
        print("shortBTC")
        GdaxCandleGen.ShortCandleGenBTC(datetime.date.today(),datetime.timedelta(minutes=15))
        print("shortLTC")
        GdaxCandleGen.ShortCandleGenLTC(datetime.date.today(),datetime.timedelta(minutes=15))
        print("LongETH")
        GdaxCandleGen.LongCandleGenETH(datetime.date.today(),datetime.timedelta(days=1))
        print("longBTC")
        GdaxCandleGen.LongCandleGenBTC(datetime.date.today(),datetime.timedelta(days=1))
        print("longLTC")
        GdaxCandleGen.LongCandleGenLTC(datetime.date.today(),datetime.timedelta(days=1))
    
    def LongCandleGenBTC(timepoint, granularity):

        gran_str = str(granularity)
        start=timepoint
        data = []
        while start>datetime.date(2008, 1, 1):
            end = timepoint
            start = timepoint - granularity * 200
            timepoint = start
            url = "https://api.gdax.com/products/BTC-USD/candles?start=" + start.isoformat() + "&end=" + end.isoformat() + "&granularity=" + '86400'#used to be gran_str, 86400 is number of seconds in a day
            resp = requests.get(url).text#returns text from response
            resp = ast.literal_eval(resp)#changes text into list
            #print('resp:',resp)
            for row in resp:
                #print(row)
                data.append(row)
            timepoint=start
            time.sleep(0.5)
        #print(data)

        with open('LONGgdaxCandleDataBTC.csv', 'w', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            for candle in data:
                    #iso = datetime.datetime.fromtimestamp(candle[0]).isoformat()
                    #csvValue = candle[0], candle[1], canlde[2], candle[3], candle[4], candle[5]
                    #print(candle)
                    csvWriter.writerow(candle)
        csvfile.close()

    def LongCandleGenETH(timepoint, granularity):

        gran_str = str(granularity)
        start=timepoint
        data = []
        while start>datetime.date(2008, 1, 1):
            end = timepoint
            start = timepoint - granularity * 200
            timepoint = start
            url = "https://api.gdax.com/products/ETH-USD/candles?start=" + start.isoformat() + "&end=" + end.isoformat() + "&granularity=" + '86400'#used to be gran_str, 86400 is number of seconds in a day
            resp = requests.get(url).text#returns text from response
            resp = ast.literal_eval(resp)#changes text into list
            #print('resp:',resp)
            for row in resp:
                #print(row)
                data.append(row)
            timepoint=start
            time.sleep(0.5)
        #print(data)

        with open('LONGgdaxCandleDataETH.csv', 'w', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            for candle in data:
                    #iso = datetime.datetime.fromtimestamp(candle[0]).isoformat()
                    #csvValue = candle[0], candle[1], canlde[2], candle[3], candle[4], candle[5]
                    #print(candle)
                    csvWriter.writerow(candle)
        csvfile.close()

    def ShortCandleGenLTC(timepoint, granularity):

        gran_str = str(granularity)
        start=timepoint
        data = []
        while start>datetime.date(2008, 1, 1):
            end = timepoint
            start = timepoint - granularity * 200
            timepoint = start
            url = "https://api.gdax.com/products/LTC-USD/candles?start=" + start.isoformat() + "&end=" + end.isoformat() + "&granularity=" + '900'#used to be gran_str, 86400 is number of seconds in a day
            resp = requests.get(url).text#returns text from response
            resp = ast.literal_eval(resp)#changes text into list
            #print('resp:',resp)
            for row in resp:
                #print(row)
                data.append(row)
            timepoint=start
            time.sleep(0.5)
        #print(data)

        with open('SHORTgdaxCandleDataLTC.csv', 'w', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            for candle in data:
                    #iso = datetime.datetime.fromtimestamp(candle[0]).isoformat()
                    #csvValue = candle[0], candle[1], canlde[2], candle[3], candle[4], candle[5]
                    #print(candle)
                    csvWriter.writerow(candle)
        csvfile.close()

     def LongCandleGenLTC(timepoint, granularity):

        gran_str = str(granularity)
        start=timepoint
        data = []
        while start>datetime.date(2008, 1, 1):
            end = timepoint
            start = timepoint - granularity * 200
            timepoint = start
            url = "https://api.gdax.com/products/LTC-USD/candles?start=" + start.isoformat() + "&end=" + end.isoformat() + "&granularity=" + '86400'#used to be gran_str, 86400 is number of seconds in a day
            resp = requests.get(url).text#returns text from response
            resp = ast.literal_eval(resp)#changes text into list
            #print('resp:',resp)
            for row in resp:
                #print(row)
                data.append(row)
            timepoint=start
            time.sleep(0.5)
        #print(data)

        with open('LONGgdaxCandleDataLTC.csv', 'w', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            for candle in data:
                    #iso = datetime.datetime.fromtimestamp(candle[0]).isoformat()
                    #csvValue = candle[0], candle[1], canlde[2], candle[3], candle[4], candle[5]
                    #print(candle)
                    csvWriter.writerow(candle)
        csvfile.close()

    def ShortCandleGenBTC(timepoint, granularity):

        gran_str = str(granularity)
        start=timepoint
        data = []
        while start>datetime.date(2008, 1, 1):
            end = timepoint
            start = timepoint - granularity * 200
            timepoint = start
            url = "https://api.gdax.com/products/BTC-USD/candles?start=" + start.isoformat() + "&end=" + end.isoformat() + "&granularity=" + '900'#used to be gran_str, 86400 is number of seconds in a day
            resp = requests.get(url).text#returns text from response
            resp = ast.literal_eval(resp)#changes text into list
            #print('resp:',resp)
            for row in resp:
                #print(row)
                data.append(row)
            timepoint=start
            time.sleep(0.5)
        #print(data)

        with open('SHORTgdaxCandleDataBTC.csv', 'w', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            for candle in data:
                    #iso = datetime.datetime.fromtimestamp(candle[0]).isoformat()
                    #csvValue = candle[0], candle[1], canlde[2], candle[3], candle[4], candle[5]
                    #print(candle)
                    csvWriter.writerow(candle)
        csvfile.close()

    def ShortCandleGenETH(timepoint, granularity):

        gran_str = str(granularity)
        start=timepoint
        data = []
        while start>datetime.date(2008, 1, 1):
            end = timepoint
            start = timepoint - granularity * 200
            timepoint = start
            url = "https://api.gdax.com/products/ETH-USD/candles?start=" + start.isoformat() + "&end=" + end.isoformat() + "&granularity=" + '900'#'900'#used to be gran_str, 86400 is number of seconds in a da
            resp = requests.get(url).text#returns text from response
            resp = ast.literal_eval(resp)#changes text into list
            #print('resp:',resp)
            for row in resp:
                #print(row)
                data.append(row)
            timepoint=start
            time.sleep(0.5)
        #print(data)

        with open('SHORTgdaxCandleDataETH.csv', 'w', newline='') as csvfile:    
            #Use csv Writer
            csvWriter = csv.writer(csvfile)
            for candle in data:
                    #iso = datetime.datetime.fromtimestamp(candle[0]).isoformat()
                    #csvValue = candle[0], candle[1], canlde[2], candle[3], candle[4], candle[5]
                    #print(candle)
                    csvWriter.writerow(candle)
        csvfile.close()
                    #print("{},{},{},{},{},{},{}".format(iso,timestamp, low, high, open_, close_, vol))

            # [1502840700, 3551.41, 3573.03, 3567.2, 3566.81, 5.052059229999997]
            # [ time,      low,     high,    open,   close,   volume ]

def main():
    print("shortETH")
    GdaxCandleGen.ShortCandleGenETH(datetime.date.today(),datetime.timedelta(minutes=15))
    print("shortBTC")
    GdaxCandleGen.ShortCandleGenBTC(datetime.date.today(),datetime.timedelta(minutes=15))
    print("shortLTC")
    GdaxCandleGen.ShortCandleGenLTC(datetime.date.today(),datetime.timedelta(minutes=15))
    print("LongETH")
    GdaxCandleGen.LongCandleGenETH(datetime.date.today(),datetime.timedelta(days=1))
    print("longBTC")
    GdaxCandleGen.LongCandleGenBTC(datetime.date.today(),datetime.timedelta(days=1))
    print("longLTC")
    GdaxCandleGen.LongCandleGenLTC(datetime.date.today(),datetime.timedelta(days=1))



if __name__ == "__main__":
    # calling main function
    main()

