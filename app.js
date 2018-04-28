const express = require('express')
const app = express()
const landmarkSearch = require('./landmarkSearch');
const getDetails = require('./getDetails');

app.set('json spaces', 2);
app.get('/', (req, res) => res.send('Urbscope 1.3.0'))
app.get('/landmark', (req,res) => {

	let inLL = req.query.inLL;
	if (!inLL){
		res.status(400);
		res.json({"error": "Bad Request", message: "missing inLL query parameter"} );
	}

	let inLimit = req.query.inLimit;
	let inRadius = req.query.inRadius;
	let inCat = req.query.inCat;
	inCat = (inCat)?inCat:'4d4b7104d754a06370d81259,56aa371be4b08b9a8d5734db,4fceea171983d5d06c3e9823,4bf58dd8d48988d1e2931735,5032792091d4c4b30a586d5c,56aa371be4b08b9a8d573532,4deefb944765f83613cdba6e,4bf58dd8d48988d181941735,507c8c4091d498d9fc8c67a9,4bf58dd8d48988d184941735,4bf58dd8d48988d17b941735,4d4b7105d754a06374d81259,4d4b7105d754a06376d81259,4d4b7105d754a06377d81259,4d4b7105d754a06379d81259,4bf58dd8d48988d1ed931735,4bf58dd8d48988d1fe931735,4f4530164b9074f6e4fb00ff,4bf58dd8d48988d129951735';

	getLandmarksAndDetails(inLL, inLimit, inRadius, inCat, res);
})

getLandmarksAndDetails = (inLL, inLimit, inRadius, inCat, res)=>{
	landmarkSearch(inLL, inLimit, inRadius, inCat, (landmarkErr, landmarkRes)=>{
		if (landmarkErr){
			res.status(400)
			res.json(landmarkErr)
		}
		else if (landmarkRes) {
			getDetails(landmarkRes, function(fullErr,fullRes){
				if (fullErr){
					res.status(400);
					res.json(fullErr);
				}
				else if(fullRes){
					res.json(fullRes);
				}
				else{
					res.json({})
				}
			})
		} 
		else{
			res.json({})
		}
	});
};

app.get('/register/:uid', (req,res)=>{
	uid = req.params.uid;
	//TODO: add uid as a new user to the recommender system
	console.log("New user with uid: ", uid);
	res.sendStatus(200);
})

app.get('/recommend/:uid', (req,res)=>{
	let uid = req.params.uid;
	let inLL = req.query.inLL;
	if (!inLL){
		res.status(400);
		res.json({"error": "Bad Request", message: "missing inLL query parameter"} );
	}

	//TODO: get top 3 categories from recommender system and add set them in array cats
	let cats = ['4d4b7104d754a06370d81259,56aa371be4b08b9a8d5734db','4fceea171983d5d06c3e9823', '56aa371be4b08b9a8d573532'];
	let inCat = cats.join(',');
	getLandmarksAndDetails(inLL, 10, 1000, inCat, res);	 

})

app.listen(process.env.PORT || 3000, () => console.log('Urbscope Server is Live'));