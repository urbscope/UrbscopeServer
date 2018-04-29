var fs = require('fs');

const TRAINED_MAT_PATH = "./helpers/trainedMat.csv";
const USER_DICT_PATH = "./helpers/userIndex.json";
const CATEGORIES_IND_PATH = "./helpers/categoryIndex.json";
const K = 3;	// do not set this higher than 19 (number of categories)

var catDict = {};
var userDict = {};

// reads categories' indices asynchronously
var readCategories = new Promise( (resolve, reject) => {
	
	fs.readFile( CATEGORIES_IND_PATH, (err,data) => {
		if(err)
			return reject(err);

		catDict = JSON.parse(data);
		resolve("Category indices are read");
	});	
});

// reads users' indices asynchronously
var readUserIndices = new Promise( (resolve, reject) => {
	
	fs.readFile( USER_DICT_PATH, (err,data) => {
		if(err)
			return reject(err);
		
		userDict = JSON.parse(data);
		resolve("User indices are read");
	});
});

// finds the top K recommended categories' indices 
var findMaxIndices = (uid, maxIndices) => {

	return new Promise( (resolve, reject) => {

		readUserIndices
			.then( res => {

				// 1. find the user's row index
				var userIndex = userDict[uid];
			
				// 2. get top K recommended categories' indices
				fs.readFile( TRAINED_MAT_PATH, (err, data) => {
					if(err)
						return reject(err);
					
					to_string = data.toString();
					lines = to_string.split('\n');
					userRatings = lines[userIndex-1].split(',').map(Number);	// 0-based indices in lines
					
					var maxIndices = [];
					// initially index 0 is the iMax (must be set, otherwise starts from index 1)
					for( i = 0; i < K; ++i)
						maxIndices[i] = userRatings.reduce( (iMax, currElem, currIndex, userRatings) =>
							currElem > userRatings[iMax] && !maxIndices.includes(currIndex) ? currIndex : iMax, 0);
										
					// return success
					resolve( maxIndices);
					 
				}); // end of readFile trainedMat.csv
				
			}).catch( err => {
				return reject( "Error at readUserIndices: ", err);
			});
	});	// end of promise
};


function getRecommendations(uid)
{
	return new Promise( (resolve, reject) => {
	
		// Returned values will be in order of the Promises passed, 
		// regardless of completion order.
		Promise.all( [findMaxIndices(uid), readCategories])
			.then( resolves => { 

				// 3. find category IDs and return them
				catKeys = Object.keys(catDict);
			
				var maxIndices = resolves[0];
				var categoryIDs = [];
				for( i of maxIndices)
					categoryIDs.push( catKeys[i]);

				resolve( categoryIDs);
				
			}).catch( err => {
				return reject(err);
			});
	}); // end of promise
}

/*
// call to the getRecommendations function above
getRecommendations( "HYvcxzaif231jtdsfa341")
	.then( res => {
		console.log( res);
	}).catch( err => {
		console.log( err);
	});
*/

module.exports = getRecommendations; 
