/*
 * Calls the given python script with the given arguments.
 * Pass the args as a comma separated list.
 */
const PythonShell = require('python-shell');

function call_script( script_name, args)
{
	var pyshell = new PythonShell(script_name, {args: args});

	console.log("INFO: Python script %s is called with args %s", script_name, args);
	
	return new Promise( (resolve, reject) => {
		
		var resolveResponse = undefined;
		pyshell.end( err => {
			if (err){
			    return reject(err);
			}
			resolve( resolveResponse)
		});

		pyshell.on('message', message => {
			// received a message sent from the Python script 
			// i.e., a simple "print" statement
			console.log( "message: " + message)
			if( resolveResponse != undefined)
				resolveResponse += "\n" + message
			else
				resolveResponse = message
		});
	}); // end of promise
}

/*
// call to call_script function above 
call_script( "./geoloc.py", [36.549978, 29.125379])
	.then( res => {
		console.log(res);
	}).catch( err => {
		console.error( err);
	});
*/

module.exports = call_script;
