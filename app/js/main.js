let city;
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

$(document).ready(function () {
    initMap();
    getTLinesAll();
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
            lat: boston.lat,
            lng: boston.lng
        },
        zoom: 12,
        styles: stylesOut
    };

    map = new google.maps.Map(document.getElementById('map'), options);

    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
}

function stationListener() {
    $('#stations').on("change", function () {
        let station = $(this).find(":selected").val();
        lat = _.findWhere(lineCurrent.data, {id: station}).attributes.latitude;
        lng = _.findWhere(lineCurrent.data, {id: station}).attributes.longitude;

        clearOverlays("markersUnderground");
        clearOverlays("circles");
        clearOverlays("markersListings");

        zoomMapToSelectedLocation();

        addMarker();
        addLayer();

        clearResults();
        getListingsBoston();
    });
};

function clearOverlays(elements) {
    mapExtras[elements].forEach(function (element) {
        element.setMap(null);
    })
}

function clearDisplayListings() {
    $(".results-value").each(function (i, e) {

    })
};

function displayListingInformation(listing) {
    renderTemplate("listing", listing, $("#results-container"));
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
            getListingsBoston();
        } else {
            alert("please fix inputs");
        }
    });
    $("#keyword-input").focusout(function () {
        if ($("input#keyword-input").val() != "") {
            clearOverlays("markersListings");
            clearResults();
            getListingsBoston();
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
            getListingsBoston()
        }
    });
}
