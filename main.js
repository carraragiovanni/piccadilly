let lines = [];
let lineCurrent;
let stationCurrent;
let map;
let mapExtras = {
    markersUnderground: [],
    markersListings: [],
    circles: [],
};

let stylesZoom = [{
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "poi",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    }
];
let stylesOut = [{
    "stylers": [{
        "visibility": "off"
    }]
}];

let lat;
let lng;

let inputsValid = true;

let device = "desktop";

let london = {
    lat: 51.507222,
    lng: -0.127500
}

$(document).ready(function () {
    initMap();
    getTFLLinesAll("tube");
    lineListener();
    rangeInputListener();
    stationListener();
    renderTemplate("listing", null, $("#results-container"));
    homeParamsListener();
    if (window.screen.width < 560) {
        device = "mobile";
        mobileSettings();
    }
});

function mobileSettings() {
    $("#map").css("width", "100%");

    $("#controls-container").css("height", "40%");
    $("#controls-container").css("width", "100%");
    $("#controls-container").css("top", "80%");
    $("#controls-container").css("flex-direction", "column");
}

function initMap() {
    let options = {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        center: {
            lat: london.lat,
            lng: london.lng
        },
        zoom: 12,
        styles: stylesOut
    };

    map = new google.maps.Map(document.getElementById('map'), options);

    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
}

function getTFLLinesAll(mode) {
    axios.get(`https://api.tfl.gov.uk/Line/Mode/${mode}`).then(function (data) {
        data.data.forEach(function (line) {
            $('<option/>', {
                text: line.name,
                value: line.id,
            }).appendTo($("#lines"));
        });
    });
}

function getTFLLineDetails(line) {
    axios.get(`https://api.tfl.gov.uk/Line/${line}/Route/Sequence/all`).then(function (data) {
        $('#stations').empty();
        $('<option/>').appendTo($("#stations"));
        lineCurrent = data.data;
        data.data.stations.forEach(function (station) {
            $('<option/>', {
                text: removeUndergroundStation(station.name),
                value: station.id,
            }).appendTo($("#stations"));
        });
    });
}

async function lineListener() {
    $('#lines').on("input", function () {
        let line = $(this).find(":selected").val();
        $.getJSON('app/assets/colors.json', function (colors) {
            if (line) {
                let color = _.findWhere(colors, {
                    lineId: line
                }).color;
                $("#text-descriptor-input-line").css("background-color", color);
                $("#text-descriptor-input-line").css("color", "white");
                getTFLLineDetails(line);
                $("#stations").prop('disabled', false);
            } else {
                $("#text-descriptor-input-line").css("background-color", "white");
                $("#text-descriptor-input-line").css("color", "black");
                map.setOptions({
                    styles: stylesOut
                });
                map.setZoom(12);
                map.setCenter({
                    lat: london.lat,
                    lng: london.lng
                });
                clearOverlays("markersUnderground");
                clearOverlays("circles");
                clearOverlays("markersListings");
                $("#stations").empty();
                $("#stations").prop('disabled', true);
            }
        });
    });
}

function stationListener() {
    $('#stations').on("change", function () {
        let station = $(this).find(":selected").val();

        lat = _.findWhere(lineCurrent.stations, {
            id: station
        }).lat;
        lng = _.findWhere(lineCurrent.stations, {
            id: station
        }).lon;

        clearOverlays("markersUnderground");
        clearOverlays("circles");
        clearOverlays("markersListings");

        zoomMapToSelectedLocation();

        addMarker();
        addLayer();

        clearResults();
        getListings();
    });
};

function zoomMapToSelectedLocation() {
    map.setZoom(14);
    map.setCenter({
        lat: lat,
        lng: lng
    });
}

function addMarker() {
    var icon = {
        url: "app/assets/underground.svg",
        scaledSize: new google.maps.Size(25, 25 * (404 / 500)), // scaled size
        anchor: new google.maps.Point(12.5, (25 * ((404 / 500)) / 2)) // anchor
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

function clearOverlays(elements) {
    mapExtras[elements].forEach(function (element) {
        element.setMap(null);
    })
}

function getListings() {
    $("#map").css("filter", "blur(4px)");
    $.ajax({
        mathod: 'GET',
        url: "https://cors-anywhere.herokuapp.com/http://api.zoopla.co.uk/api/v1/property_listings.json?",
        data: {
            api_key: "ndzhkukmdu7sa2tyhg8xbqm2",
            latitude: lat,
            longitude: lng,
            listing_status: "sale",
            minimum_price: $("select#min-price").val(),
            maximum_price: $("select#max-price").val(),
            minimum_beds: $("select#min-beds").val(),
            maximum_beds: $("select#max-beds").val(),
            page_size: 100,
            radius: $("#distance-input").val() / 10,
            sort_by: "age",
            keyword: $("input#keyword-input").val()
        }
    }).done(function (data) {
        $("#map").css("filter", "");
        if (data.listing.length != 0) {
            addListingMarkers(data.listing);
        } else {
            alert("no listings found, expand search criteria")
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function addListingMarkers(listings) {
    var icon = {
        url: "app/assets/listingIcon.svg",
    };

    listings.forEach(function (listing) {
        var marker = new google.maps.Marker({
            position: {
                lat: listing.latitude,
                lng: listing.longitude
            },
            map: map,
            icon: icon,
            listing_id: listing.listing_id,
            data: listing,
            opened: false
        });
        mapExtras.markersListings.push(marker);
        google.maps.event.addListener(marker, 'click', function () {
            marker.setIcon('app/assets/currentListingIcon.svg');
            marker.opened = true;
            clearDisplayListings();
            displayListingInformation(this.data);
        });
        if (marker.opened == true) {
            console.log("banan");
        }
    });
}

function clearDisplayListings() {
    $(".results-value").each(function (i, e) {

    })
};

function displayListingInformation(listing) {
    renderTemplate("listing", null, "results-container");
    $("#listing-description-value").html(listing.short_description);
    $("#listing-address-value").html(listing.displayable_address);
    $("#listing-price-value").html(listing.price);
    $("#listing-beds-value").html(listing.num_bedrooms);
    $("#listing-baths-value").html(listing.num_bathrooms);
    $("#listing-floorplan-value").html(listing.floorplan);
    $("#listing-url-value").attr("href", listing.details_url);
}

function homeParamsListener() {
    $('.home-params-select').on("input", function () {
        let paramType;
        if ($(this).hasClass("bed-input")) {
            paramType = "bed-input";
        } else if ($(this).hasClass("bath-input")) {
            paramType = "bath-input";
        } else if ($(this).hasClass("price-input")) {
            paramType = "price-input";
        }

        let min = parseInt($("." + paramType + ".min-input").val());
        let max = parseInt($("." + paramType + ".max-input").val());

        if ($(this).hasClass("min-input")) {
            if (min > max) {
                $(this).addClass("error-input");
                inputsValid = false;
            } else {
                $(this).removeClass("error-input");
                inputsValid = true;
            }
        } else if ($(this).hasClass("max-input")) {
            if (max < min) {
                $(this).addClass("error-input");
                inputsValid = false;
            } else {
                $(this).removeClass("error-input");
                inputsValid = true;
            }
        }

        if (inputsValid == true) {
            clearOverlays("markersListings");
            clearResults();
            getListings();
        } else {
            alert("please fix inputs");
        }
    });
    $("#keyword-input").focusout(function () {
        if ($("input#keyword-input").val() != "") {
            clearOverlays("markersListings");
            clearResults();
            getListings();
        }
    })
}

function clearResults() {
    $(".results-value").each(function (i, e) {
        e.innerHTML = "";
    });
}

function removeUndergroundStation(name) {
    if (name.slice(name.length - 19) == "Underground Station") {
        return name.slice(0, name.length - 20);
    } else {
        return name;
    }
}

function rangeInputListener() {
    $("#distance-input").on("change", function () {
        $("#distance-input-value").html($("#distance-input").val() / 10);
        if (mapExtras.circles.length != 0) {
            mapExtras.circles[0].setMap(null);
            clearOverlays("markersListings");
            clearResults();
            addLayer();
            getListings()
        }
    });
}

function renderTemplate(templateName, data, container) {
    if (!data) {
        data = {}
    }
    container.html("");
    let t = JST[templateName];
    let h = t(data);
    container.html(h);
}

this["JST"] = this["JST"] || {};

this["JST"]["listing"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>banana</h1>\n\n";
},"useData":true});