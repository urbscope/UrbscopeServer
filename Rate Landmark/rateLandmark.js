/*
 * Updates the rating of a landmark that the user has rated
 * Requires userID, user's latitude and longitude
 */

const fs = require('fs');
const callPythonScript = require('../callPythonScript');
const getLandmarkID = require('./getLandmarkID');
let {inClient_id, inClient_secret} = require('../config');

// note that the below paths are defined relative to callPythonScript.js
// since we're using CITIES_PATH as an arugment to it
const CATEGORIES_PATH = "./Rate Landmark/categories.txt"
const CITIES_PATH = "./Cities/"

var getCategoryIDs = () => {

	var categories = fs.readFileSync(CATEGORIES_PATH, 'utf8');
	lines = categories.split("\n");
	categoryIDs = [];
	
	for( let i = 0; i < lines.length-1; i++)
		categoryIDs.push(lines[i].split(":")[0]);

	return categoryIDs
};

/*
 * Call rate.py to rate/update a rating
 * @def rate(uid, destID, rating, filename):
 */
var updateRating = (uid, landmarkID, rating, cityCSV) => {
	return new Promise( (resolve, reject) => {

		// note that the below path is defined relative to app.js
		// since we're using rateLandmark from there
		callPythonScript("./Rate Landmark/rate.py", [uid, landmarkID, rating, cityCSV])
			.then( res => {
				return resolve(res);
			}).catch( err => {
				return reject(err);
			});
	});
};

/*
 * Helper for getLandmarkID to ensure that each category is written to
 * city.txt file before proceeding to creation of city.csv file
 *
 * Gets landmarks from a specified city and creates a file "city.txt" 
 * with data in the following format:
 * 		destinationID, destinationName, categoryID
 */
async function getLandmarkHelper( cityName, inLL, categoryIDs)
{
	var inV = '20170801';		// Foursquare version
	var inLimit = 50;			// 50 landmarks for each category
	var radius =  1000000;		// 1000 km

	for( let i = 0; i < categoryIDs.length; ++i)
	{
		// didn't use catch here because if an error is thrown, 
		// the returned promise by getLandmarkHelper will automatically be rejected with that error
		let promise = new Promise( (resolve, reject) => {
			getLandmarkID( inClient_id, inClient_secret, inLL, inV, inLimit, radius, categoryIDs[i])
				.then( res => {
					resolve(res);
				});
		}); // end of promise
	
		let res = await promise;
		lmarks = res['landmarks'];
		//console.log(lmarks)
		for( let k = 0; k < lmarks.length; k++)
		{
			let str = lmarks[k]['destinationID'] + ", " + lmarks[k]['name'] + ", " + categoryIDs[i] + "\n"
			fs.appendFileSync( CITIES_PATH + cityName + ".txt", str);
		}
		
		console.log( i + ".category is written");
	}
		
	return `${CITIES_PATH}${cityName}.txt is created`;
}

function rateLandmark(uid, lat, long, rating, landmarkID)
{
	return new Promise( (resolve,reject) => {
		/*
		 1. acquire the city from latitude and longitude by calling geoloc.py
		 	@def findCityName( lat, long)
		*/
		// note that the below path defined relative to callPythonScript.js
		// since we're using rateLandmark from there
		callPythonScript("./geoloc.py", [lat, long])
			.then( cityName => {
				
				if( cityName.includes("nowhere!"))
					throw new Error( "Latitude & longitude match nowhere!");
				
				// 2. check if the city txt file, e.g. London.txt, exists
				cities = fs.readdirSync( CITIES_PATH);
				let doesContain = false;
				for( c of cities)
					if( c.includes( cityName))
					{
						doesContain = true;
						break;
					}
				
				let cityTXT = CITIES_PATH + cityName + ".txt";
				let cityCSV = CITIES_PATH + "CSV_Files/Ratings/" + cityName + ".csv";
				
				if( !doesContain)
				{
					console.log( "INFO: %s does not exist in the dataset, creating a new file for it...", cityTXT);
					
					/*
					 2.1. create the file by calling getLandmarkID.js
					 	@def getLandmarkID = function ( inClient_id, inClient_secret, inll, inQuery, inV, inLimit, inRadius,inCat, callback)
					*/
					var inLL = "" + lat + "," + long;
					var categoryIDs = getCategoryIDs();
					
					getLandmarkHelper( cityName, inLL, categoryIDs)
						.then( res => {
							console.log( "INFO: " + res);
							/*
							 2.2. call fileToMatrix.py to generate csv file for that city.
								@def matrixGen(fileName, uid)
							*/
							// note that the below path is defined relative to callPythonScript.js
							// since we're using rateLandmark from there
							callPythonScript("./Rate Landmark/fileToMatrix.py", [cityTXT, uid, cityCSV])
								.then( res => {
									console.log( "INFO: " + cityCSV + " is created with " + res + " columns(landmarks)");
									
									// 3. update rating
									updateRating( uid, landmarkID, rating, cityCSV)
										.then( res => {
											// return success
											return resolve(res);
										}).catch( err => {
											return reject( "Error at rateLandmark.js (updateRating[1]): " + err);
										});
									
								}).catch( err => {
									return reject( "Error at rateLandmark.js (fileToMatrix.py): " + err);
								});	// end of fileToMatrix.py
								
						}).catch( err => {
							return reject("Error at rateLandmark.js (getLandmarkHelper): " + err);
						}); // end of getLandmarkHelper
				}
				else
				{
					// city already exists in the dataset
					console.log( "INFO: %s exists in the dataset.", cityName);
					
					// just update rating
					updateRating( uid, landmarkID, rating, cityCSV)
						.then( res => {
							// return success
							return resolve(res);
						}).catch( err => {
							return reject( "Error at rateLandmark.js (updateRating[2]): " + err);
						});
				}
			}).catch( err => {
				return reject( "Error at rateLandmark.js (geoloc.py): " + err);
			}); // end of geoloc.py call
			
	}); // end of promise
} // end of rateLandmark

/*
 * call to rateLandmark function above
 * @def rateLandmark(uid, lat, long, rating, landmarkID)
*/
// 10.575446, 123.927654 => Danao City 
// 39.425474, 29.964103  => Kutahya 
// 41.066498, 29.028607  =>	Istanbul
// 12, 148               => Nowhere (North Pasific Ocean)

/*
rateLandmark("myUserID456", 31.337911 , 88.149696, 5, "landmarkID456")
	.then( res => {
		console.log( res);
	}).catch( err => {
		console.error( err);
	});
*/
module.exports = rateLandmark;
