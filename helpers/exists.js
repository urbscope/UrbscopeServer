var fs = require('fs');

const RATINGS_PATH = "./helpers/ratings.csv";
const USER_DICT_PATH = "./helpers/userIndex.json";
const COLUMNS = 19;

function exists(uid)
{
	return new Promise( (resolve, reject) => {
	
		fs.readFile( USER_DICT_PATH, function (err, data) {
		
			if(err)
				return reject(err);

			var json = JSON.parse(data);
		
			// if uid exists
			if( json[uid] != undefined)
				return reject( "UID is not unique!");
		
			// add 0-row to rankings matrix
			let zeroRow = "";
			for( i = 0; i < COLUMNS-1; ++i)
				zeroRow += "0.0, "
			zeroRow += "0.0\n"
		
			// creates the file if it does not exist
			fs.appendFile( RATINGS_PATH, zeroRow, (err) => {
			
				if(err)
					return reject(err);
			
				let numberOfLines = Object.keys(json).length;
			
				// append new user's index number to userIndex.json
				json[uid] = numberOfLines + 1;
				let data = JSON.stringify(json, null, '\t');
			
				fs.writeFile( USER_DICT_PATH, data, (err) => {

					if( err)
					{
						// delete the extra 0-row that has been just appended and reject
						fileBuffer = fs.readFileSync( RATINGS_PATH);
						to_string = fileBuffer.toString();
						
						let i = to_string.lastIndexOf("\n");
						if( i+1 == to_string.length)
							i = to_string.lastIndexOf("\n", i-2);
						to_string = to_string.substring( 0, i);
						
						// replaces the file if it already exists
						fs.writeFileSync( RATINGS_PATH, to_string);
						
						return reject(err);
					}
					
					// return success
					resolve( 'New user is sucessfully added!');
				});
			});
		});	// end of async readFile
	});	// end of promise
}

/*
// call to the exists function above
exists( "vEWYbhty546GFfdQ24dsv")
	.then( res => {
		console.log( res);
	}).catch( err => {
		console.log( "err: " + err)
	});
*/

module.exports = exists;
