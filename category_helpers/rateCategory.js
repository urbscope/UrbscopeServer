var fs = require('fs');

const RATINGS_PATH = "./category_helpers/ratings.csv";
const USER_DICT_PATH = "./category_helpers/userIndex.json";
const CATEGORIES_IND_PATH = "./category_helpers/categoryIndex.json";
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

function rateCategory(uid, catID, rating, userDict)
{
	return new Promise( (resolve, reject) => {

		var userIndex = userDict[uid];
		if( userIndex == undefined)
			return reject( "No such user exists.");
		if( rating < 0 || rating > 5)
			return reject( "Rating should be in the range [0, 5]");
			
		// 2. find the category's index
		readCategories
			.then( res2 => {
				var catKeys = Object.keys(catDict);
				var catIndex = catKeys.indexOf(catID);
				if( catIndex == -1)
					return reject( `Error at readCategoeris: CategoryID ${catID} is not recognized!`);
					
				var catIndex = catIndex + 1;	// index numbers start from 1 in the files
				
				// characters(including ',' and '\n') are 2 bytes
				var startOffset = (userIndex-1) * 2 * COLUMNS + 2 * (catIndex-1);
				
				// 3. update the rating value from ratings.csv
				const readStream = fs.createReadStream( RATINGS_PATH, {start: startOffset, end: startOffset});
				readStream.on('data', chunk => {
					// take average of new rating and old rating
					prevRating = Number(chunk.toString());
					rating = Math.round( (Number(rating) + prevRating) / 2);
					const writeStream = fs.createWriteStream( RATINGS_PATH, { flags: "r+", start: startOffset });
					writeStream.end( String(rating));
				});
				
				// return success
				resolve("Category rating is updated");
				
			}).catch( err2 => {
				return reject( "Error at readCategories: ", err2);
			});
	}); // end of promise
}

module.exports = rateCategory;
