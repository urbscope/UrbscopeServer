/*
 * Calls train.py for re-training the recommendation system.
 */

const callPythonScript = require('../callPythonScript');

function train()
{
	return new Promise( (resolve, reject) => {
	
		callPythonScript("./train.py", undefined)
			.then( res => {
				return resolve(res);
			}).catch( err => {
				return reject("Error at train.js: " + err);
			});
	});
}


// call to train function above
train().then( res => console.log(res)).catch( err => console.error( err));

module.exports = train;
