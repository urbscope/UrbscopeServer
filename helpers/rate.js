var fs = require('fs');

const RATINGS_PATH = "./helpers/ratings.csv";
const USER_DICT_PATH = "./helpers/userIndex.json";
const CATEGORIES_IND_PATH = "./helpers/categoryIndex.json";
const COLUMNS = 19;

var catDict = {};

// reads categories' indices asynchronously
var readCategories = new Promise( (resolve, reject) => {
	
	fs.readFile( CATEGORIES_IND_PATH, (err,data) => {
		if(err)
			return reject(err);

		catDict = JSON.parse(data);
		resolve("Category indices are read");
	});	
});

function rate(uid, catID, rating, userDict)
{
	return new Promise( (resolve, reject) => {

		var userIndex = userDict[uid];
		if( userIndex == undefined)
			return reject( "No such user exists.");
			
		// 2. find the category's index
		readCategories
			.then( res2 => {
				var catKeys = Object.keys(catDict);
				var catIndex = catKeys.indexOf(catID) + 1;	// index numbers start from 1 in the files
				
				// characters(including ',' and '\n') are 2 bytes
				var startOffset = (userIndex-1) * 2 * COLUMNS + 2 * (catIndex-1);
				
				// 3. update the rating value from ratings.csv
				const file = fs.createWriteStream( RATINGS_PATH, { flags: "r+", start: startOffset });
				file.end( rating);
				
				// return success
				resolve("Rating is updated");
				
			}).catch( err2 => {
				return reject( "Error at readCategories: ", err2);
			});
	}); // end of promise
}

module.exports = rate;
