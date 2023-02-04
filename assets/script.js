var city;

// today's date
var today = moment().format("D/M/YYYY");

// gets the user input when the search button is clicked

$("#search-button").on("click", function(event) {

    event.preventDefault();

    city = $("#search-input").val().trim();


    var apiKey = "31d2a57690ef85e96a85e5e5562d0140"

    var geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; 

    // Gets the coordinates from the city name
    $.ajax({
    url: geoAPI,
        method: "GET"
        
    }).then(function(response) {

        // location latitude
        var lat = response[0].lat;

        // location longitude
        var lon = response[0].lon;

        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        // Gets the weather data from the coordinates
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function(data) {
            console.log(data);

            var results = data.list;

            // data for today
            var todayData = results[0];
            // weather for today 
            var todayW = {date: today, icon: todayData.weather[0].icon, temp: (todayData.main.temp - 273.15).toFixed(), wind: todayData.wind.speed, humidity: todayData.main.humidity};
            var daysW = [];

            console.log(todayW);

            // loops through the results and select the items where the time is 12:00
            for (var i = 1; i < results.length; i++) {

                // stores the item data
                var dayData = results[i];

                // stores the item date and time
                var date = dayData.dt_txt;

                // checks if the item time is 12:00
                if (date.includes("12:00:00")) {


                    // stores the item specific weather data
                    var icon = dayData.weather[0].icon;
                    var temp = (dayData.main.temp - 273.15).toFixed();
                    var wind = dayData.wind.speed
                    var humidity = dayData.main.humidity;

                    // creates an object for the selected day with the corresponding weather data
                    var day = {date: date, icon: icon, temp: temp, wind: wind, humidity: humidity}

                    // pushes each object to the array to get the 5-days forecast
                    daysW.push(day);
                }
                
            } 
            console.log(daysW);
            renderToday(todayW);

            
        })

    })

})

function renderToday(todayW) {

    $("#today").append(`<h4>${city} (${todayW.date})<img src=http://openweathermap.org/img/wn/${todayW.icon}@2x.png></h4>`);
    $("#today").append(
        `<p>
<pre>
Temp: ${todayW.temp}°C
Wind: ${todayW.wind} KPH
Humidity: ${todayW.humidity}%
</pre>
        </p>`
        );
    
}
