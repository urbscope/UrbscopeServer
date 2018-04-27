const express = require('express')
const app = express()
const landmarkSearch = require('./landmarkSearch');
const getPhotos = require('./getPhotos');


app.set('json spaces', 2);
app.get('/', (req, res) => res.send('Urbscope 1.0.0'))
app.get('/landmark', (req,res) => {

	let inLL = req.query.inLL;
	let inLimit = req.query.inLimit;
	let inRadius = req.query.inRadius;
	let inCat = req.query.inCat;

	if (!inLL){
		res.status(400);
		res.json({"error": "Bad Request", message: "missing inLL query parameter"} );
	}
	else{
		landmarkSearch(inLL, inLimit, inRadius, inCat, (landmarkErr, landmarkRes)=>{
			if (landmarkErr){
				res.status(400)
				res.json(landmarkErr)
			}
			else if (landmarkRes)

				getPhotos(landmarkRes, function(fullErr,fullRes){
					if (fullErr){
						res.status(400)
						res.json(fullErr)
					}
					else if(fullRes){
						res.json(fullRes)
					}
					else
						res.json({})
				
				}
			else
				res.json({})
		});
	}
})


app.listen(process.env.PORT || 3000, () => console.log('Urbscope Server is Live'))