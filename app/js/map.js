async function lineListener() {
    $('#lines').on("input", function () {
        let line = $(this).find(":selected").val();
        if (line) {
            getTLineDetails(line);
            $("#stations").prop('disabled', false);
        } else {
            $("#text-descriptor-input-line").css("background-color", "white");
            $("#text-descriptor-input-line").css("color", "black");
            map.setOptions({
                styles: stylesOut
            });
            map.setZoom(12);
            map.setCenter({
                lat: boston.lat,
                lng: london.lng
            });
            clearOverlays("markersUnderground");
            clearOverlays("circles");
            clearOverlays("markersListings");
            $("#stations").empty();
            $("#stations").prop('disabled', true);
        }
    });
}

function zoomMapToSelectedLocation() {
    map.setZoom(14);
    map.setCenter({
        lat: lat,
        lng: lng
    });
}

function addMarker() {
    var icon = {
        url: "app/assets/t.png",
        scaledSize: new google.maps.Size(25, 25), // scaled size
        anchor: new google.maps.Point(12.5, 12.5) // anchor
        // scaledSize: new google.maps.Size(25, 25 * (404 / 500)), // scaled size
        // anchor: new google.maps.Point(12.5, (25 * ((404 / 500)) / 2)) // anchor
    };
    var marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        map: map,
        icon: icon
    });
    mapExtras.markersUnderground.push(marker);
}

function addLayer() {
    clearOverlays("circles");
    var circle = new google.maps.Circle({
        fillColor: '#ffffff',
        fillOpacity: 0.5,
        strokeWeight: 0,
        map: map,
        center: {
            lat: lat,
            lng: lng
        },
        radius: ($("#distance-input").val() / 10) * 1609.344
    });
    map.setOptions({
        styles: stylesZoom
    });
    mapExtras.circles.push(circle);
}
