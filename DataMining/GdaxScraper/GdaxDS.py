import requests, csv, ast, gdax
from gdaxWebsocketClient import gdaxWebsocketClient

class GdaxDS:
	client = gdax.PublicClient()

	def getCurves():
		Bitcoin = client.get_product_order_book('BTC-USD', level=2)
		Ether = client.get_product_order_book('ETH-USD', level=2)

	'''
	def webSocket():
		wsClient = gdax.WebsocketClient(url="wss://ws-feed.gdax.com", products=["BTC-USD", "ETH-USD"])
		

		print(Bitcoin)
		print(Ether)

		wsClient.close()
	'''

def main():
	GdaxDS.webSocket()

if __name__ == "__main__":
    # calling main function
    main()
