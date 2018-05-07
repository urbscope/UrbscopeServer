const fs = require('fs');
const callPythonScript = require('../callPythonScript');

const K = 5	// do not set this higher than 19 (number of categories)

function getLandmarkRecommendations( uid, lat, long)
{
	return new Promise( (resolve, reject) => {
	
		// note that the below paths are defined relative to app.js
		// since this method is called from there
		callPythonScript("./geoloc.py", [lat, long])
			.then( cityName => {
				
				callPythonScript("./Get Landmark Recommendations/getRecommendations.py", [cityName, uid, K])
					.then( landmarkIDs => {
						if( landmarkIDs == '0')
							// call to category getRecommendations.js
							return reject( "No landmark is returned for this user and city");
						else if( landmarkIDs == '-1')
						{
							console.log( "INFO: cannot read csv files");
							return reject( "No landmark is returned for this user and city");
						}
						else
							return resolve( landmarkIDs);
					}).catch( err => {
						return reject(err);
					});
			}).catch( err => {
				return reject(err);
			});
	}); // end of promise
}

/*
// call to getRecommendations function above
// 41.066498, 29.028607  =>	Istanbul
getLandmarkRecommendations( 'a', 41.066498, 29.028607)
	.then( res => {
		console.log("res: " + res);
	}).catch( err => {
		console.error("err: " + err);
	});
*/

module.exports = getLandmarkRecommendations;
