import gdax, time, threading, csv, sqlite3
from threading import Thread

#importing mongo push module
import importlib.util,os,inspect

path=os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path=path[0:51]
path+='db/serve.py'

spec = importlib.util.spec_from_file_location("serve.py", path)
serve = importlib.util.module_from_spec(spec)
spec.loader.exec_module(serve)
#end of module importation

class gdaxWebsocketClientBitcoin(gdax.WebsocketClient):
	def on_open(self):
		self.url = "wss://ws-feed.gdax.com/"
		self.products = ["BTC-USD"]

	def on_message(self, msg):
		serve.serve(msg,'BitcoinGDAXWS')

	def on_close(self):
		print("-- Goodbye! --")

class gdaxWebsocketClientEthereum(gdax.WebsocketClient):
	def on_open(self):
		self.url = "wss://ws-feed.gdax.com/"
		self.products = ["ETH-USD"]

	def on_message(self, msg):
		serve.serve(msg,'EthereumGDAXWS')

	def on_close(self):
		print("-- Goodbye! --")

class gdaxWebsocketClientLitecoin(gdax.WebsocketClient):
	def on_open(self):
		self.url = "wss://ws-feed.gdax.com/"
		self.products = ["LTC-USD"]

	def on_message(self, msg):
		serve.serve(msg, 'LitecoinGDAXWS')

	def on_close(self):
		print("-- Goodbye! --")


def litecoin():
	wsClientLtc = gdaxWebsocketClientLitecoin()
	wsClientLtc.start()
	#wsClientLtc.close()


def bitcoin():
	wsClientBtc = gdaxWebsocketClientBitcoin()
	wsClientBtc.start()
	#wsClientBtc.close()


def ethereum():
	wsClientEth = gdaxWebsocketClientEthereum()
	wsClientEth.start()
	#wsClientEth.close()

def main():
	Thread(target = bitcoin).start()
	Thread(target = ethereum).start()
	Thread(target = litecoin).start()

if __name__ == "__main__":
	# calling main function
	main()



	#depricated method here for future reference
	'''
	#print(msg)
	line = []
	if 'price' in msg:
		line.append(msg["price"])#"\t@ {:.3f}".format(float(msg["price"]))
	else: line.append('Null')
	if'type' in msg:
		line.append(msg["type"])
	else: line.append('Null')
	if'side' in msg:
		line.append(msg["side"])
	else: line.append('Null')
	if'time' in msg:
		line.append(msg["time"])
	else: line.append('Null')
	if'sequence' in msg:
		line.append(str(msg["sequence"]))
	else: line.append('Null')
	if'reason' in msg:
		line.append(msg["reason"])
	else: line.append('Null')
	if'remaining_size' in msg:
		line.append(msg["remaining_size"])
	else: line.append('Null')
	if'size' in msg:
		line.append(msg["size"])
	else: line.append('Null')

	#conn = sqlite3.connect('gdaxETH.db')
	#c = conn.cursor()
	#c.execute("INSERT INTO GdaxETH VALUES (?,?,?,?,?,?,?,?)",line)
	#conn.commit()
	#conn.close()

	with open('1gdaxWS_ETH.csv', 'a', newline='') as csvfile:    
		#Use csv Writer
		csvWriter = csv.writer(csvfile)
		#writes the message
		csvWriter.writerow(line)
	csvfile.close()
	#print(msg)
	'''