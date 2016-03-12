

//add listener
//document.getElementById("addButton").addEventListener("click", addClick);

function getGeo(){
	
	
	var qString = 'https://www.googleapis.com/geolocation'
	qString += '/v1/geolocate?key=AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg'
	
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
			
			
			//document.getElementById("demoText").textContent = req.responseText;
			
			var tString = "myLatLong: " + myLatLong
			
			document.getElementById("demoText").textContent = tString;
			
			
		} else {
			
			//there was an error
			console.log("Error in network request: " + req.statusText);
		};
	});
	
	//activates when call comes back
	req.send(null);
	
	//Chicago
	//lat: +41.921542
	//lng: -87.702482
	//Chi: latlng=41.921542,-87.702482
	//Atl: latlng=33.794633,-84.448771
	//church 33.758468, -84.408005
}
