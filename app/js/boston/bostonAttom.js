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
