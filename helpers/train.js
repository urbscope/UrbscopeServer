var pyShell = require('python-shell-master');

function train()
{
	return new Promise( (resolve, reject) => {

		var shell = new pyShell('predictions.py');

		shell.end(function (err){
			if (err){
			    return reject(err);
			};
		
		});
		resolve("Training Matrix generated")

	}); // end of promise
}



