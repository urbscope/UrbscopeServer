var fs = require('fs');

const RATINGS_PATH = "./helpers/ratings.csv";
const USER_DICT_PATH = "./helpers/userIndex.json";
const CATEGORIES_IND_PATH = "./helpers/categoryIndex.json";
const COLUMNS = 19;

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


function rate(uid, catID, rating)
{
	return new Promise( (resolve, reject) => {

		// 1. find the user's index
		readUserIndices
			.then( res => {
				var userIndex = userDict[uid];

				// 2. find the category's index
				readCategories
					.then( res2 => {
						var catKeys = Object.keys(catDict);
						var catIndex = catKeys.indexOf(catID) + 1;	// index numbers start from 1 in the files
						
						// characters(including ',' and '\n') are 2 bytes
						var startOffset = (userIndex-1) * 2 * COLUMNS + 2 * (catIndex-1);
						
						// 3. update the rating value from ratings.csv
						const file = fs.createWriteStream( RATINGS_PATH, { flags: "r+", start: startOffset });
						file.write( rating);
						
						// return success
						resolve("Rating is updated");
						
					}).catch( err2 => {
						return reject( "Error at readCategories: ", err2);
					});
			
			}).catch( err => {
				return reject( "Error at readUserIndices: ", err);
			});
	}); // end of promise
}

module.exports = rate;
