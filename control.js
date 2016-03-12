

//add listener
//document.getElementById("addButton").addEventListener("click", addClick);

//Chicago
//lat: +41.921542
//lng: -87.702482
//Chi: latlng=41.921542,-87.702482
//Atl: latlng=33.794633,-84.448771
//church 33.758468, -84.408005

//here we go

function getGeo(){
	
	var myKey = 'AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg';
	var qString = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + myKey;
	
	var draftLatLong = '33.758468,-84.408005';
	
	//alert("Get geo!");
	
	var req = new XMLHttpRequest();
	req.open("POST", qString, true); //true for async!
	
	//waits for the response to load
	req.addEventListener('load',function(){
		//check status
		if(req.status >= 200 && req.status < 400){
			

			//alert("we got it!");
			
			var obj = JSON.parse(req.responseText);
			var myLatLong = obj.location.lat + "," + obj.location.lng;
			
			document.getElementById("demoText").textContent = "myLatLong: " + myLatLong;
			document.getElementById("demoText2").textContent = "draftLatLong: " + draftLatLong;
			
			//get distance
			
			
			
			
			
			
			
			
			
			
		} else {
			
			//there was an error
			console.log("Error in network request: " + req.statusText);
		};
	});
	
	//activates when call comes back
	req.send(null);
	

}
