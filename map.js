
var allMarkers = []; // array of all markers
var infoWindow; // declared so there can only be one infowindow open at a time
var map;

function initMap() {
	$.getJSON("map.json", function(mapstyle) {
		map = new google.maps.Map(document.getElementById('map'), {
			center: new google.maps.LatLng(49.9569, -119.3787),
			zoom: 7,
			styles: mapstyle,
			disableDefaultUI: true,
		    scaleControl: true,
		    zoomControl: true,
		    zoomControlOptions: {
		      style: google.maps.ZoomControlStyle.LARGE 
		    }
		});
	});

	// init info window
 	infoWindow = new google.maps.InfoWindow;

	// create markers for each plane
	$.getJSON('map.php', function(data){
		console.log(data);
		data['acList'].forEach(function(aircraft){
			addMarker(aircraft);
		});


	});
}

function addMarker(aircraft) {

	var aircraftImages = [
		"images/jet.png",
		"images/turboprop_wing.png",
		"images/prop_nose.png"
	];

	// select correct aircraft image
	// TODO: tidy this up, add more images/checks
	var aircraftImage = aircraftImages[0]; // default is jet
	if (aircraft['EngType'] == 3) {
		aircraftImage = aircraftImages[0];
	} else if (aircraft['EngType'] == 1) {
		aircraftImage = aircraftImages[2];
	} else if (aircraft['EngType'] == 2 || aircraft['EngMount'] == 5 || aircraft['EngMount'] == 2) {
		aircraftImage = aircraftImages[1];
	}

	// position and label
	var latlng = {lat: aircraft['Lat'], lng: aircraft['Long']};
	var label = aircraft['Type'];

	// load the icon image so height and width can be extracted
	var img = new Image();
	img.onload = function() {

		// custom aircraft icon
		var customIcon = {
			url: "rotate.php?deg=" + aircraft['Trak'] + "&img=" + aircraftImage, // rotate to correct heading
			labelOrigin: new google.maps.Point(this.width/2, this.height + 5) // label offset
		};

		// create marker
		var marker = new google.maps.Marker({
			map: map,
			position: latlng,
			label: {
				text: label, 
				color:"orange",
				fontFamily: "Lato"
			},
			icon: customIcon
		});

		allMarkers.push({reg: aircraft['Reg'], marker: marker});


		// info window text
		if (aircraft['From'] == null) {
			aircraft['From'] = "N/A";
		}
		if (aircraft['To'] == null) {
			aircraft['To'] = "N/A";
		}

        infocontent = "<h3>" + aircraft['Mdl'] + "</h3>"
        	+"<p><b>ICAO: </b>" + aircraft['Icao'] + "<br>"
        	+"<b>Reg: </b>" + aircraft['Reg'] + "<br />"
        	+"<b>Operator: </b>" + aircraft['Op'] + "<br />"
        	+"<b>From: </b>" + aircraft['From'] + "<br />"
        	+"<b>To: </b>" + aircraft['To'] + "<br />"
        	+"<b>Speed: </b>" + aircraft['Spd'] + " kts<br />"
        	+"<b>Altitude: </b>" + aircraft['Alt'] + " ft</p>";

        // add listener for infowindow
		bindInfoWindow(marker, map, infoWindow, infocontent); 

	};
	img.src = "rotate.php?deg=" + aircraft['Trak'] + "&img=" + aircraftImage; // set img src (calls above listener function)
}

function refreshMap() {
	setInterval(function() {
		
		$.getJSON('map.php', function(data){
			console.log(data);
			data['acList'].forEach(function(aircraft){
				var isNewAircraft = true;
				var markerToUpdate = null;
				allMarkers.forEach(function(existingMarker) {
					if (existingMarker.reg == aircraft['Reg']) {
						isNewAircraft = false;
						markerToUpdate = existingMarker.marker;
					}
				});

				if (isNewAircraft) { // add a new aircraft
					addMarker(aircraft);
				} else { // just update the position of existing marker
					var latlng = {lat: aircraft['Lat'], lng: aircraft['Long']};
					markerToUpdate.setPosition(latlng);
				}

		});


	});



	}, 5000);
}

function bindInfoWindow(marker, map, infowindow, html) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
        infowindow.open(map, this);
    });
} 