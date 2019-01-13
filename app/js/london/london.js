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