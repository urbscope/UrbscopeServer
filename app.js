const express = require('express');
const app = express();
const landmarkSearch = require('./landmarkSearch');
const getDetails = require('./getDetails');
const addSponsorInfo = require('./addSponsorInfo');
const fs = require('fs');

// category-based recommender system helper functions
const exists = require('./category_helpers/exists');
const getCategoryRecommendations = require('./category_helpers/getCategoryRecommendations');
const rateCategory = require('./category_helpers/rateCategory');

const USER_DICT_PATH = "./category_helpers/userIndex.json";
var userDict = {};

// landmark-based recommender system helper functions
const getLandmarkRecommendations = require('./Get Landmark Recommendations/getLandmarkRecommendations');
const rateLandmark = require('./Rate Landmark/rateLandmark');

// store users' indices into memory asynchronously after server lunch
fs.readFile( USER_DICT_PATH, (err,data) => {
	if(err)
		throw new Error(err);
	
	userDict = JSON.parse(data);
	// console.log(userDict);
});

app.set('json spaces', 2);
app.get('/', (req, res) => res.send('Urbscope 1.5.0'));
app.get('/landmark', (req,res) => {

	let inLL = req.query.inLL;
	if (!inLL){
		res.status(400);
		res.json({"error": "Bad Request", message: "missing inLL query parameter"} );
		return;
	}

	let inLimit = req.query.inLimit;
	let inRadius = req.query.inRadius;
	let inCat = req.query.inCat;
	inCat = (inCat)?inCat:'4d4b7104d754a06370d81259,56aa371be4b08b9a8d5734db,4fceea171983d5d06c3e9823,4bf58dd8d48988d1e2931735,5032792091d4c4b30a586d5c,56aa371be4b08b9a8d573532,4deefb944765f83613cdba6e,4bf58dd8d48988d181941735,507c8c4091d498d9fc8c67a9,4bf58dd8d48988d184941735,4bf58dd8d48988d17b941735,4d4b7105d754a06374d81259,4d4b7105d754a06376d81259,4d4b7105d754a06377d81259,4d4b7105d754a06379d81259,4bf58dd8d48988d1ed931735,4bf58dd8d48988d1fe931735,4f4530164b9074f6e4fb00ff,4bf58dd8d48988d129951735';

	getLandmarksAndDetails(inLL, inLimit, inRadius, inCat, res);
});


getLandmarksAndDetails = (inLL, inLimit, inRadius, inCat, res)=>{
	landmarkSearch(inLL, inLimit, inRadius, inCat, (landmarkErr, landmarkRes)=>{
		if (landmarkErr) {
			console.error( landmarkErr);
			res.status(400)
			res.json({"error": "landmarkSearch", message: landmarkErr} );
		}
		else if (landmarkRes) {
			getDetails(landmarkRes, (err, resolve) => {
				if(err) {
					console.error( err);
					res.status(400)
					res.json({"error": "getDetails", message: err} );
				}
				
				if(resolve) {
					addSponsorInfo(resolve);
					res.json(resolve);
				}
				else
					res.json({});
			});
		}
		else
			res.json({});
	});
};

app.get('/register/:uid', (req,res)=>{
	uid = req.params.uid;
	console.log("/register/uid: " + uid);
	
	// add uid as a new user to the recommender system
	// if uid is unique
	exists( uid, userDict)
		.then( resolve => {
			console.log( resolve);
			res.sendStatus(200);
		}).catch( err => {
			// console.error( "err: " + err)
			res.sendStatus(200);
			//res.json( {error: "Bad Request", message: err});
		});
});

app.get('/rate/:uid', (req,res)=>{
	let uid = req.params.uid;
	let landmarkID = req.query.landmarkID;
	let categoryID = req.query.categoryID;
	let rating = req.query.rating;
	let inLL = req.query.inLL;
	if (!uid || !landmarkID || !categoryID || !rating || !inLL) {
		res.status(400);
		res.json({"error": "Bad Request", message: "missing some parameters"} );
		return;
	}
	
	if( userDict[uid] == undefined) {
		res.status(400);
		res.json({"error": "Bad Request", message: "No such user exists."} );
		return;
	}
	
	let latLong = inLL.split(',');
	
	console.log("rate/uid: " + uid);
	
	// don't wait the user for backend stuff
	res.sendStatus(200);
	
	// update ratings in the recommender systems' files
	Promise.all( [rateCategory( uid, categoryID, rating, userDict), rateLandmark( uid, latLong[0], latLong[1], rating, landmarkID)])
		.then( resolves => {
			console.log( resolves[0]);	// rateCategory's resolve
			console.log( resolves[1]);	// rateLandmark's resolve
		}).catch( err => {
			console.error( err)
		});
});

app.get('/recommend/:uid', (req,res)=>{
	let uid = req.params.uid;
	let inLL = req.query.inLL;
	if (!inLL){
		res.status(400);
		res.json({"error": "Bad Request", message: "missing inLL query parameter"} );
		return;
	}
	
	if( userDict[uid] == undefined) {
		res.status(400);
		res.json({"error": "Bad Request", message: "No such user exists."} );
		return;
	}
	
	let latLong = inLL.split(',');
	
	console.log("recommend/uid: " + uid);

	// get top 5 landmarks from landmark-based recommender system
	getLandmarkRecommendations( uid, latLong[0], latLong[1])
		.then( resolve => {
			console.log(resolve);
			
			// convert res (which is csv string) into a dict with 'landmarks' key
			// whose value is a list that consists of landmarkIDs
			let resDict = {
				landmarks: []
			};
			
			resolve.split(',').forEach( landmarkID => resDict.landmarks.push(landmarkID));
			console.log(resDict);
			
			getDetails( resDict, (detailsErr, detailsResult) => {
				if( detailsErr)
				{
					console.error( detailsErr);
					res.status(400);
					res.json( {error: "getDetails", message: detailsErr});
					return;
				}
				else if( detailsResult)
				{
					res.status(200);
					res.json( detailsResult);
				}
			});
			
		}).catch( err => {
		
			if( err == "No landmark is returned for this user and city")
			{
				console.log( "INFO: No recommended landmarks. Trying to get recommended categories...");
				// then get top 3 categories from category-based commender system
				getCategoryRecommendations( uid, userDict)
					.then( resolve => {
						console.log( resolve);
						let inCat = resolve.join(',');
						getLandmarksAndDetails(inLL, 10, 100000, inCat, res);
						
					}).catch( err => {
						console.log( err);
						res.status(400);
						res.json( {error: "Bad Request", message: err});
					});
			}
			else
			{
				console.error( err);
				res.status(400);
				res.json( {error: "getLandmarkRecommendations", message: err});
			}
		});
});

app.listen(process.env.PORT || 3000, () => console.log('Urbscope Server is Live'));
