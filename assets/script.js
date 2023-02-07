var city;

// today's date
var today = moment().format("D/M/YYYY");


renderHistory();

// Gets the user input when the search button is clicked and get the weather data
$("#search-button").on("click", function(event) {

    event.preventDefault();

    city = $("#search-input").val().trim();

    getWeather(city);
    storesCity(city);

    // resets input field 
    $("#search-input").val("");

})

// Retrieves the weather data when the city button is clicked from the history
$(document).on('click', ".history", function(event) {

    event.preventDefault();

    city = event.target.textContent;
    getWeather(city);

})


// Gets the weather data for a specific city
function getWeather(city) {

    var apiKey = "31d2a57690ef85e96a85e5e5562d0140"

    var geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; 

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

            var results = data.list;

            // data for today
            var todayData = results[0];
            // weather for today 
            var todayW = {date: today, icon: todayData.weather[0].icon, temp: (todayData.main.temp - 273.15).toFixed(), wind: todayData.wind.speed, humidity: todayData.main.humidity};
            // to store 5-day forecast
            var daysW = [];

            // loops through the results and select the items where the time is 12:00
            for (var i = 1; i < results.length; i++) {

                // stores the item data
                var dayData = results[i];

                // stores the item date and time
                var date = dayData.dt_txt;

                // checks if the item time is 12:00 and if array only have 4 items
                if ( (date.includes("12:00:00")) || ((i === (results.length - 1)) && (daysW < 5) )) {

                    // stores the item's specific weather data
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

            // Renders todays weather
            renderToday(todayW);

            //Renders 5-day forecast
            renderForecast(daysW);
        })
    })
}

// Dispays today's weather data
function renderToday(todayW) {

     $("#today").empty();

    $("#today").css("border", "1px solid");


    $("#today").append(`<h4>${city} (${todayW.date})<img src=http://openweathermap.org/img/wn/${todayW.icon}@2x.png></h4>`);
    $("#today").append(
        `<pre>
Temp: ${todayW.temp}°C
Wind: ${todayW.wind} KPH
Humidity: ${todayW.humidity}%
        </pre>`
        ); 
}

// Dispays 5-day forecast
function renderForecast(daysW) {

    $("#forecast").empty();

    $("#forecast").append(`<h5>5-Day Forecast:</h5>`);        
    $("#forecast").append(`<div class="card-deck"></div>`);

    for (var j = 0; j < daysW.length; j++) {

        $(".card-deck").append(`<div class="card" id=${j}></div>`);
        
        $(`#${j}`).append(`<h6>${moment(daysW[j].date).format('D/M/YYYY')}</h5>`);

        $(`#${j}`).append(`<img src=http://openweathermap.org/img/wn/${daysW[j].icon}@2x.png>`)
        
        $(`#${j}`).append(`<pre>
        
Temp: ${daysW[j].temp}°C
Wind: ${daysW[j].wind} KPH
Humidity: ${daysW[j].humidity}%
</pre>`);}
}

// Stores new city searched to local storage and displays new button
function storesCity(city){

    var history = [];

        if (JSON.parse(localStorage.getItem("history")) !== null) {

            history = JSON.parse(localStorage.getItem("history"))

            if (history.includes(city)) {
                return;
            }
        }

        $(".input-group-append").after($(`<button id=${city}>${city}</button>`));
        $(`#${city}`).attr("class", "btn history")

        history.push(city);

        localStorage.setItem("history", JSON.stringify(history));

}

// Displays the history list
function renderHistory() {

    cityHistory = JSON.parse(localStorage.getItem("history"));

    if (cityHistory !== null) {
    

        for (var k = 0; k < cityHistory.length; k++ ) {
            $(".input-group-append").after($(`<button id=${cityHistory[k]}>${cityHistory[k]}</button>`));
            $(`#${cityHistory[k]}`).attr("class", "btn history")
        }
    }
}



