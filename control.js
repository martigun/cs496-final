

//add listener
//document.getElementById("addButton").addEventListener("click", addClick);

function getGeo(){
	
	
	alert("Get geo!");
	
	
}


//on city click
function addClick(Content){
	
	//alert("addClick was clicked!");
	
	var name = document.getElementById("input_name").value;
	
	//check that name is filled in
	if(!name) {
		alert("Name must be filled in!");
		return;
	};
	
	var reps = document.getElementById("input_reps").value
	var weight = document.getElementById("input_weight").value
	var date = document.getElementById("input_date").value
	//convert date
	// if(input_date){
		// var date = new Date(input_date);
		// input_date = date.toDateString();
	// }
	var lbs = document.getElementById("input_lbs").value
	
	
	var qString = "/addrow2?";
	
	qString += "name=" + name;
	qString += "&reps=" + reps;
	qString += "&weight=" + weight;
	qString += "&date=" + date;
	qString += "&lbs=" + lbs;
	
	alert(qString);
	
	var req = new XMLHttpRequest();
	req.open("GET", qString, true); //true for async!
	
	//waits for the response to load
	req.addEventListener('load',function(){
		//check status
		if(req.status >= 200 && req.status < 400){
			

			//get the table on sucess
			getTable();
			console.log("success!");
			
		} else {
			
			//there was an error
			console.log("Error in network request: " + req.statusText);
		};
	});
	
	//activates when call comes back
	req.send(null);
	
	
	
	
};