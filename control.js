

//add listener
//document.getElementById("addButton").addEventListener("click", addClick);

//Chicago
//lat: +41.921542
//lng: -87.702482
//Chi: latlng=41.921542,-87.702482
//Atl: latlng=33.794633,-84.448771
//church 33.758468,-84.408005
//austin 30.25,-97.75

//here we go

function getGeo(){
	
	var myKey = 'AIzaSyBp8lIReveKnqn9vVuxHslFpJxv0Fj0stg';
	var qGeoString = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + myKey;
	var qDirString = 'https://maps.googleapis.com/maps/api/directions/json?';
	
	var draftLatLong = '30.25,-97.75';
	
	//alert("Get geo!");
	
	var req = new XMLHttpRequest();
	req.open("POST", qGeoString, true); //true for async!
	
	//waits for the response to load
	req.addEventListener('load',function(){
		//check status
		if(req.status >= 200 && req.status < 400){
			

			//alert("we got it!");
			
			var obj = JSON.parse(req.responseText);
			var myLatLong = obj.location.lat + "," + obj.location.lng;
			
			document.getElementById("demoText").textContent = "myLatLong: " + myLatLong;
			document.getElementById("demoText2").textContent = "draftLatLong: " + draftLatLong;
			
			//set up qDirString
			qDirString += 'origin=' + myLatLong;
			qDirString += '&destination=' + draftLatLong;
			qDirString += '&key=' + myKey;
			
			//run getDistance
			getDistance(qDirString);
			
		} else {
			
			//there was an error
			console.log("Error in network request: " + req.statusText);
		};
	});
	
	//activates when call comes back
	req.send(null);

	

}

function getDistance(qDirString){
	
	
	document.getElementById("demoText3").textContent = qDirString;
	
	//get distance
	var req = new XMLHttpRequest();
	req.open("POST", qDirString, true); //true for async!

	//wait for response to load
	req.addEventListener('load',function(){

		alert("Directions success!");	

		document.getElementById("demoText4").textContent = req.responseText;



	})

	req.send(null);
	
	
	
}
