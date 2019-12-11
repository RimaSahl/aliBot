const HollaEx = require('hollaex-node-lib');
const _ = require('lodash');

const MY_ACCESS_TOKEN = '';

var client = new HollaEx({ apiURL:'https://api.exir.io', baseURL: '/v0', accessToken: MY_ACCESS_TOKEN });

const pair = 'btc-tmn';

let hasOrder = false;

let asks = [];
let price = 0;
let i = 10;


const cancel = async () => {
	await client.cancelAllOrder(pair);
	hasOrder = false;
	console.log('cancelled all');
};
// cancel()

const checkBook = async (data) => {
	try {
		if (data.symbol === pair) {
			asks = data[pair].asks;
			console.log(asks, asks[0])
			const total = asks.reduce((t, level) => {
				console.log("t",t)
				console.log("level",level[1])
				return t + level[1]
			}, 0);
			
			if (total > 5 && hasOrder) {
				cancel()
			} else {
				if (!hasOrder) {
					let r = _.random(0,1);
					if (r < 0.25) {
						i = 7
					} else if (r >= 0.25 && r < 0.5) {
						i = 7
					} else if (r >= 0.5 && r < 0.75) {
						i = 8
					} else if (r >= 0.75) {
						i = 9
					}
					price = asks[i][0];
					let amount = _.random(2.0001, 4.500);
					amount = Number(amount.toFixed(4));
					// await client.createOrder(pair, 'sell', amount, 'limit', price);
					console.log(price, amount)
					hasOrder = true;
				} else {
					
					if (Number(asks[9][0]) < Number(price)) {
						cancel();
					} else {
						asks.forEach((a, index) => {
							if (a[0] === price) {
								if (index != i) {
									console.log(a[0], index, i)
									cancel();
								}
							}
						})
					}
				}
			}
		}
	}
	catch(e) {
		console.error(e)
	}
};

const socket = client.connect('orderbook');
socket.on('orderbook', _.debounce(checkBook, 1000));
// socket.on('orderbook', (data) => {
//     console.log(data);
// });