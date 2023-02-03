var apiKey = "31d2a57690ef85e96a85e5e5562d0140"

var city;

// location latitude
var lat;
// location longitude
var lon;

// Gets the coordinates from the city name
function getCoor(city) {

    var geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;  //&limit={limit}

    $.ajax({
        url: geoAPI,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        lat = response[0].lat;
        lon = response[0].lon;
        console.log(lat);
    });

    // returns the latitude and longitude
    return [lat, lon];

}

var coord = getCoor("bagdad")

    // Gets weather data for specific coordinates
    function getWeather(coord);
    var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

