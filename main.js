function getListingsBoston() {
    $("#map").css("filter", "blur(4px)");
    $.ajax({
        method: 'GET',
        url: `https://api.attomdata.com/property/v2/propertysearch/geo/${lat}/${lng}/5`,
        headers: {
            Accept: "application/json",
            'Ocp-Apim-Subscription-Key': 'aa15cc07c7ee4ca487d11c3e19934634'
        }
    }).done(function (data) {
        $("#map").css("filter", "");
        debugger;
        if (data.RESPONSE_GROUP.RESPONSE.RESPONSE_DATA.PROPERTY_INFORMATION_RESPONSE_ext.SUBJECT_PROPERTY_ext.PROPERTY.length != 0) {
            addListingMarkersBoston(data.RESPONSE_GROUP.RESPONSE.RESPONSE_DATA.PROPERTY_INFORMATION_RESPONSE_ext.SUBJECT_PROPERTY_ext.PROPERTY);
        } else {
            alert("no listings found, expand search criteria")
        }
    }).fail(function (error) {
        console.log(error);
    });
}


function addListingMarkersBoston(listings) {
    var icon = {
        url: "app/assets/listingIcon.svg",
    };

    listings.forEach(function (listing) {
        let latListing = parseFloat(listing.location.latitude);
        let lngListing = parseFloat(listing.location.longitude);
        
        var marker = new google.maps.Marker({
            position: {
                lat: latListing,
                lng: lngListing
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
            // clearDisplayListings();
            displayListingInformation(this.data);
        });
        if (marker.opened == true) {
            console.log("banan");
        }
    });
}

let boston = {
    lat: 42.357308,
    lng: -71.064474
}

function getTLinesAll() {
    axios.get(`https://api-v3.mbta.com/routes?filter[type]=0,1`).then(function (data) {
        data.data.data.forEach(function (line) {
            $('<option/>', {
                text: line.id,
                value: line.id,
            }).appendTo($("#lines"));
        });
    });
}

function getTLineDetails(line) {
    axios.get(`https://api-v3.mbta.com/stops?filter[route]=${line}`).then(function (data) {
        $('#stations').empty();
        $('<option/>').appendTo($("#stations"));
        lineCurrent = data.data;
        data.data.data.forEach(function (station) {
            $('<option/>', {
                text: station.attributes.name,
                value: station.id,
            }).appendTo($("#stations"));
        });
    });
}
let london = {
    lat: 51.507222,
    lng: -0.127500
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
function getListingsLondon() {
    $("#map").css("filter", "blur(4px)");
    $.ajax({
        mathod: 'GET',
        url: "https://cors-anywhere.herokuapp.com/http://api.zoopla.co.uk/api/v1/property_listings.json?",
        data: {
            api_key: "5ddqa2q64pg3pxtdtzgjzc6x",
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
            addListingMarkersLondon(data.listing);
        } else {
            alert("no listings found, expand search criteria")
        }
    }).fail(function (error) {
        console.log(error);
    });
}

function addListingMarkersLondon(listings) {
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
            // clearDisplayListings();
            displayListingInformation(this.data);
        });
        if (marker.opened == true) {
            console.log("banan");
        }
    });
}

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

this["JST"] = this["JST"] || {};

this["JST"]["listing"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"listing-description\" class=\"flex line\">\n    <p id=\"listing-description-text\" class=\"results-text\">description</p>\n    <p id=\"listing-description-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.short_description || (depth0 != null ? depth0.short_description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"short_description","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-address\" class=\"flex line\">\n    <p id=\"listing-address-text\" class=\"results-text\">address</p>\n    <p id=\"listing-address-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.displayable_address || (depth0 != null ? depth0.displayable_address : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayable_address","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-price\" class=\"flex line\">\n    <p id=\"listing-price-text\" class=\"results-text\">price</p>\n    <p id=\"listing-price-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-beds\" class=\"flex line\">\n    <p id=\"listing-beds-text\" class=\"results-text\">beds</p>\n    <p id=\"listing-beds-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.num_bedrooms || (depth0 != null ? depth0.num_bedrooms : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"num_bedrooms","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-baths\" class=\"flex line\">\n    <p id=\"listing-baths-text\" class=\"results-text\">baths</p>\n    <p id=\"listing-baths-value\" class=\"results-value\">"
    + alias4(((helper = (helper = helpers.num_bathrooms || (depth0 != null ? depth0.num_bathrooms : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"num_bathrooms","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div id=\"listing-url\" class=\"flex line\">\n    <a id=\"listing-url-value\" class=\"results-text\" target=\"_blank\" href="
    + alias4(((helper = (helper = helpers.details_url || (depth0 != null ? depth0.details_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"details_url","hash":{},"data":data}) : helper)))
    + ">url</a>\n</div> \n";
},"useData":true});
function renderTemplate(templateName, data, container) {
    if (!data) {
        data = {}
    }
    container.html("");
    let t = JST[templateName];
    let h = t(data);
    container.html(h);
}
