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
