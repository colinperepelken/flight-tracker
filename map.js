


function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(49.9569, -119.3787),
		zoom: 7
	});

	var icon = new google.maps.MarkerImage(
		"images/airplane-marker.png"
	);

	$.getJSON('map.php', function(data){
		console.log(data);
		data['acList'].forEach(function(aircraft){

			var latlng = {lat: aircraft['Lat'], lng: aircraft['Long']};
			var label = aircraft['Mdl'];

			var marker = new google.maps.Marker({
				map: map,
				position: latlng,
				label: label,
				icon: icon
			});
		});


	});
}