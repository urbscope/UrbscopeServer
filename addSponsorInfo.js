addSponsorInfo = (obj)=>{
	let sponsoredItem = {
		destinationID: 'SPONSOREDPLACE0',
		name: 'Starbucks',
		latitude: '39.867903',
		longitude: '32.748122',
		address: [
			'SA Building',
			'Bilkent University Main Campus',
			'Ankara',
			'Turkey'
		],
		categoryID: '4bf58dd8d48988d1e0931735',
		category: 'Coffee Shop',
		picture: 'http://www.pngmart.com/files/3/Starbucks-Logo-PNG-Image.png',
		description: 'One person, one cup, one neighborhood at a time!'
	}
	obj['sponsoredItem'] = sponsoredItem;
}
module.exports = addSponsorInfo;
