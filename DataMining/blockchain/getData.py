import requests, csv, re, json

class blockchainInfo():

	
	def __init__(self):
		self.BTCcharts=["market-cap","trade-volume","hash-rate","cost-per-transaction","transaction-fees","n-unique-addresses","n-transactions","transactions-per-second","n-transactions-excluding-popular","estimated-transaction-volume"]
		self.BTC_URLpart1,self.BTC_URLpart2,self.BTC_URLpart3="https://api.blockchain.info/charts/","?timespan=","&format=json&sampled=false"


	def compileHistoricData(self):
		timeSpan="10years"
		data=[]
		names=[]
		for chart in self.BTCcharts:
			resp=requests.get(self.BTC_URLpart1+chart+self.BTC_URLpart2+timeSpan+self.BTC_URLpart3).text
			text=(json.loads(resp))
			data.append(text["values"])
			names.append(text["name"])
		'''
			print(text["values"])
			print('')
			print('')
			print('')
			print('')
		'''
		#print(data)
		return (names,data)		

	def saveHistoricData(self):
		names,data=self.compileHistoricData()
		with open('historicBlockchainDataBTC.csv', 'w', newline='') as csvfile:
			#Use csv Writer
			csvWriter = csv.writer(csvfile)

			#add names to top of datafile
			self.BTCcharts.insert(0,'date')
			csvWriter.writerow(self.BTCcharts)

			#grab dates
			dates=[]
			for date in data[0]:
				dates.append(date['x'])

			#print(data)
			for i in range(0, len(data[0])):
				row=[]
				row.append(dates[i])
				for dataType in data:
					if i<len(dataType):
						row.append(dataType[i]['y'])
					else: row.append('na')
				csvWriter.writerow(row)
		csvfile.close()

def main():
	bc=blockchainInfo()
	bc.saveHistoricData()

if __name__ == "__main__":
    # calling main function
    main()