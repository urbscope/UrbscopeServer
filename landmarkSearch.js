const request = require('request');
const inV = '20170801';

let {inClient_id, inClient_secret} = require('./config');

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
		    		
		    		searchResults.landmarks.push(jsonBody.response.venues[i].id);
		    	}
		    	callback(null, searchResults);
		   	}
	    }
	});
};

module.exports = getLandmarks;
