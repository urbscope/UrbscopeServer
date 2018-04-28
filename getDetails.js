const request = require('request');

const inClient_id = 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH';
const inClient_secret  = '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK';
const inV = '20170801';
const picSize = '100x100'

var getDetails = async function ( venueRes, callback){
	
	var  detailsResult = {
		landmarks: []
	};

	let completed = 0;

	for (var i = 0; i < venueRes.landmarks.length; i++){
		var inVenueId = (venueRes.landmarks[i])
	
		await request({
		    url: `https://api.foursquare.com/v2/venues/${inVenueId}`,
		    method: 'GET',
		    qs: {
		        client_id: inClient_id,
		        client_secret: inClient_secret,
		        v: inV,
		    }

		}, function (err, res, body) {
			if (err) {
		        console.error(err);
		        callback(new Error('err'))
		    } 
		    else {

		    	let destData = {};
		    	jsonBody = JSON.parse(body);
		    	
		    	let urlStr = null;
		    	if (jsonBody.response.venue.photos.count > 0){
			    	picJson = jsonBody.response.venue.photos.groups[0].items[0];
			    	data = JSON.stringify(picJson, null, 4);
			    	prefix = picJson.prefix;
			    	suffix = picJson.suffix;
			    	urlStr = prefix + picSize + suffix;
			    }
		    	destData['destinationID'] = jsonBody.response.venue.id;
		    	destData['name'] = jsonBody.response.venue.name;
		    	destData['latitude'] = jsonBody.response.venue.location.lat;
		    	destData['longitude'] = jsonBody.response.venue.location.lng;
		    	destData['address'] = jsonBody.response.venue.location.formattedAddress;
		    	if (jsonBody.response.venue.categories[0]){
			    	destData['categoryID'] = jsonBody.response.venue.categories[0].id;
			    	destData['category'] = jsonBody.response.venue.categories[0].name;
		    	}
		    	if (urlStr){
		    		destData['picture'] = urlStr;
		    	}
		    	desc = jsonBody.response.venue.description;
		    	if (desc){
		    		destData['description'] = desc;
		    	}

		    	detailsResult.landmarks.push(destData);
		    	completed++;
		    	if (completed == venueRes.landmarks.length){
	    			callback(null, detailsResult);
		    	}
		    }
		});
	}

};

module.exports = getDetails;