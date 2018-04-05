const request = require('request');
const fs = require('fs');

const inClient_id = 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH';
const inClient_secret  = '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK';
const inV = '20170801';

var getLandmarks = function ( inll, inQuery, inLimit, inOpenNow, inRadius, callback){

	var  searchResults = {
		landmarks: []	
	};
	
	request({
	    url: 'https://api.foursquare.com/v2/venues/explore',
	    method: 'GET',
	    qs: {
	        client_id: inClient_id,
	        client_secret: inClient_secret,
	        ll: inll,
	        query: inQuery,
	        v: inV,
	        limit: inLimit,
	        openNow: inOpenNow,
			radius: inRadius,
	        sortByDistance: 1
	    }

	}, function (err, res, body) {
		if (err) {
	        callback(err)
	    } 
	    else {
	    	let jsonBody = JSON.parse(body)
	    	
	    	//check for success
	    	let meta = jsonBody.meta
	    	if (meta.code != 200){ 
	    		callback({error: "landmark Search Error", message: meta.errorType + ": " + meta.errorDetail})
	    	}
	    	else {
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
		    	fs.writeFileSync('file.json', data);
		    	data = JSON.stringify(searchResults, null, 4);	
		    	fs.writeFileSync('results.json', data);
		    	callback(null, searchResults);
		   	}
	    }
	});
};

module.exports = getLandmarks;
