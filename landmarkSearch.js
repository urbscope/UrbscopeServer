const request = require('request');

const inClient_id = 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH';
const inClient_secret  = '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK';
const inV = '20170801';

var getLandmarks = function ( inll, inLimit, inRadius, inCat, callback){

	var  searchResults = {
		landmarks: []	
	};
	
	request({
	    url: 'https://api.foursquare.com/v2/venues/search',
	    method: 'GET',
	    qs: {
	        client_id: inClient_id,
	        client_secret: inClient_secret,
	        ll: inll,
	        v: inV,
	        limit: inLimit,
			radius: inRadius,
			categoryId: inCat
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
	    	for (var i = 0; i < jsonBody.response.venues.length; i++){
		    		var destData = {};
		    		destData['destinationID'] = jsonBody.response.venues[i].id;
		    		destData['name'] = jsonBody.response.venues[i].name;
		    		destData['latitude'] = jsonBody.response.venues[i].location.lat;
		    		destData['longitude'] = jsonBody.response.venues[i].location.lng;
		    		destData['address'] = jsonBody.response.venues[i].location.formattedAddress;
		    		destData['categoryID'] = jsonBody.response.venues[i].categories[0].id;
		    		searchResults.landmarks.push(destData);
		    	}
		    	callback(null, searchResults);
		   	}
	    }
	});
};

module.exports = getLandmarks;
