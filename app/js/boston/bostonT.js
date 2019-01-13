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