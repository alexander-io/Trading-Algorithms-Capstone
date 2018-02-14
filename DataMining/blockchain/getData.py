import requests, csv, re, json, time, pprint

#importing mongo push module
import importlib.util

path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path=path[0:51]
path+='db/serve.py'

spec = importlib.util.spec_from_file_location("serve.py", path)
serve = importlib.util.module_from_spec(spec)
spec.loader.exec_module(serve)
#end of module importation

class blockchainInfo():

	
	def __init__(self):
		self.BTCcharts=["market-cap","trade-volume","hash-rate","cost-per-transaction","transaction-fees","n-unique-addresses","n-transactions","n-transactions-excluding-popular","estimated-transaction-volume"]
		self.BTC_URLpart1,self.BTC_URLpart2,self.BTC_URLpart3="https://api.blockchain.info/charts/","?timespan=","&format=json&sampled=false"

	def pollData(self,timeSpan):
		data=[]
		names=[]
		for chart in self.BTCcharts:
			resp=requests.get(self.BTC_URLpart1+chart+self.BTC_URLpart2+timeSpan+self.BTC_URLpart3).text
			text=(json.loads(resp))
			#print(text)
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
		names,data=self.pollData('10years')
		#add names to top of datafile
		self.BTCcharts.insert(0,'date')
		#grab dates
		dates=[]
		for date in data[0]:
			dates.append(date['x'])

		for i in range(0, len(data[0])):
			row=[]
			row.append(dates[i])
			for dataType in data:
				if i<len(dataType):
					row.append(dataType[i]['y'])
				else: row.append('na')
			post = {
				'date' : str(dates[i]),
				'market-cap' : str(row[0]),
				'trade-volume' : str(row[1]),
				'hash-rate' : str(row[2]),
				'cost-per-transaction' : str(row[3]),
				'transaction-fees' : str(row[4]),
				'n-unique-addresses' : str(row[5]),
				'n-transactions' : str(row[6]),
				'n-transactions-excluding-popular' : str(row[7]),
				'estimated-transaction-volume' : str(row[8])
			}
			serve.serve(post, 'BitcoinChain')

		'''
		with open('historicBlockchainDataBTC.csv', 'w', newline='') as csvfile:
			#Use csv Writer
			csvWriter = csv.writer(csvfile)

			

			
			#print(data)
			
		csvfile.close()
		'''

	def getCurrentData(self):
		names,data=self.pollData('2days')
		collection = db.BitcoinChain
		#add names to top of datafile
		self.BTCcharts.insert(0,'date')
		#grab dates
		row=[]
		row.append(data[0][0]['x'])
		for dataType in data:
			row.append(dataType[0]['y'])


		post = {
			'date' : str(row[9]),
			'market-cap' : str(row[0]),
			'trade-volume' : str(row[1]),
			'hash-rate' : str(row[2]),
			'cost-per-transaction' : str(row[3]),
			'transaction-fees' : str(row[4]),
			'n-unique-addresses' : str(row[5]),
			'n-transactions' : str(row[6]),
			'n-transactions-excluding-popular' : str(row[7]),
			'estimated-transaction-volume' : str(row[8])
		}
		serve.serve(post, 'BitcoinChain')

		'''
		names,data=self.pollData('2days')
		with open('historicBlockchainDataBTC.csv', 'a', newline='') as csvfile:
			#Use csv Writer
			csvWriter = csv.writer(csvfile)
			row=[]
			row.append(data[0][0]['x'])
			for dataType in data:
				row.append(dataType[0]['y'])
			csvWriter.writerow(row)
		csvfile.close()
		'''



def main():
	print("starting blockchain dump")
	bc=blockchainInfo()
	bc.getCurrentData()

if __name__ == "__main__":
    # calling main function
    main()