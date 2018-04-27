const request = require('request');
const fs = require('fs');

const inClient_id = 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH';
const inClient_secret  = '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK';
const inV = '20170801';
const limit = 1;
const picSize = '100x100'

var getPhotos = function ( venueRes, callback){
	
	var  response = {
		landmarks: []
	};

	for (var i = 0; i < venueRes.landmarks.length; i++){
		var inVenueId = (venueRes.landmarks[i])
	
		request({
		    url: `https://api.foursquare.com/v2/venues/${inVenueId}`,
		    method: 'GET',
		    qs: {
		        client_id: inClient_id,
		        client_secret: inClient_secret,
		        v: inV,
		        limit: inLimit
		    }

		}, function (err, res, body) {
			if (err) {
		        console.error(err);
		        callback(new Error('err'))
		    } 
		    else {

		    	var destData = {}
		    	jsonBody = JSON.parse(body)
		    	picJson = jsonBody.response.venue.photos.groups[0].items[0]
		    	data = JSON.stringify(picJson, null, 4);
		    	prefix = picJson.prefix
		    	suffix = picJson.suffix
		    	urlStr = prefix + picSize + suffix
		    	desc = jsonBody.response.venue.description
		    	if (String(desc) == "undefined"){
		    		desc = jsonBody.response.venue.categories[0].name
		    	}
		    	destData['destinationID'] = jsonBody.response.venue.id
		    	destData['name'] = jsonBody.response.venue.name
		    	destData['latitude'] = jsonBody.response.venue.location.lat
		    	destData['longitude'] = jsonBody.response.venue.location.lng
		    	destData['address'] = jsonBody.response.venue.location.formattedAddress
		    	destData['categoryID'] = jsonBody.response.venue.categories[0].id
		    	destData['category'] = jsonBody.response.venue.categories[0].name
		    	destData['picture'] = urlStr
		    	destData['description'] = desc
		    	response.landmarks.push(destData);
		    	
		    	data = JSON.stringify(response, null, 4);	
		    	fs.writeFileSync('response.json', data);
		    	callback(null, response);

		    	/**
		    	for (var i = 0; i < jsonBody.response.venues.length; i++){
		    		console.log('Item Found')

		    		var destData = {};
		    		destData['destinationID'] = jsonBody.response.venues[i].id;
		    		photo = getPhotos(inClient_id, inClient_secret,inV, 1, jsonBody.response.venues[i].id )
		    		destData['name'] = jsonBody.response.venues[i].name;
		    		destData['latitude'] = jsonBody.response.venues[i].location.lat;
		    		destData['longitude'] = jsonBody.response.venues[i].location.lng;
		    		destData['address'] = jsonBody.response.venues[i].location.formattedAddress;
		    		destData['categoryID'] = jsonBody.response.venues[i].categories[0].id;
		    		destData['category'] = jsonBody.response.venues[i].categories[0].name;
		    		searchResults.landmarks.push(destData);
		    	}

		    	/**
		    	for (var i = 0; i < jsonBody.response.groups[0].items.length; i++){

		    		var destData = {};

		    		destData['destinationID'] = jsonBody.response.groups[0].items[i].venue.id;
			    	destData['name'] = jsonBody.response.groups[0].items[i].venue.name;
			    	destData['latitude'] = jsonBody.response.groups[0].items[i].venue.location.lat;
			    	destData['longitude'] = jsonBody.response.groups[0].items[i].venue.location.lng;
			    	destData['address'] = jsonBody.response.groups[0].items[i].venue.location.formattedAddress;
			    	destData['categoryID'] = jsonBody.response.groups[0].items[i].venue.categories[0].id;
			    	destData['category'] = jsonBody.response.groups[0].items[i].venue.categories[0].name;
			    	searchResults.landmarks.push(destData);
		    	}
				
		    	
		    	var data = JSON.stringify(jsonBody, null, 4);
		    	fs.appendFileSync('file.json', data);
		    	data = JSON.stringify(searchResults, null, 4);	
		    	fs.writeFileSync('results.json', data);
		    	callback(null, searchResults);*/
		    	
		    }
		});
	}
};

module.exports = getPhotos;