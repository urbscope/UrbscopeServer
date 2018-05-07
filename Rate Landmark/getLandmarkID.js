const request = require('request');
const fs = require('fs');

var getLandmarkID = async function( inClient_id, inClient_secret, inLL, inV, inLimit, inRadius,inCat) {

	var  searchResults = {
		landmarks: []
	};
	
	let promise = new Promise( (resolve, reject) => {
	
		request({
			url: 'https://api.foursquare.com/v2/venues/search',
			method: 'GET',
			qs: {
			    client_id: inClient_id,
			    client_secret: inClient_secret,
			    ll: inLL,
			    v: inV,
			    limit: inLimit,
				radius: inRadius,
				categoryId: inCat 
			}

		}, function (err, res, body) {
			if (err) {
			    return reject( err)
			}
			else {
				
				jsonBody = JSON.parse(body)
				
				for (var i = 0; i < jsonBody.response.venues.length; i++){
					//console.log('Item Found %d', i)

					var destData = {};
					destData['destinationID'] = jsonBody.response.venues[i].id;
					destData['name'] = jsonBody.response.venues[i].name;
					destData['latitude'] = jsonBody.response.venues[i].location.lat;
					destData['longitude'] = jsonBody.response.venues[i].location.lng;
					destData['address'] = jsonBody.response.venues[i].location.formattedAddress;
					destData['categoryID'] = jsonBody.response.venues[i].categories[0].id;
					searchResults.landmarks.push(destData);
				}

				//var data = JSON.stringify(jsonBody, null, 4);
				//var data = JSON.stringify(searchResults, null, 4);
				resolve(searchResults);
			}
		}); // end of request
	}); // end of promise
	
	let res = await promise;
	return res;
};

module.exports = getLandmarkID;
