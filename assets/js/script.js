var todaysWeatherEl = document.querySelector(".search-results-today");
var rightSideEl = document.querySelector(".right-side");
var apiKey = "445fe2f3fe4b002f404c5234955b5915";

var clearForm = function () {
    $(".search-results-today").remove();
    $(".five-day-forcast-header").remove();
    $(".five-day-forcast").remove();
};

var fiveDayForcast = function (data) {
    console.log(data);
    var fiveDayForcastHeaderEl = document.createElement("h2")
    fiveDayForcastHeaderEl.className = "five-day-forcast-header";
    fiveDayForcastHeaderEl.textContent = "5 Day Forcast:"
    rightSideEl.appendChild(fiveDayForcastHeaderEl);
    var fiveDayForcastEl = document.createElement("div");
    fiveDayForcastEl.className = "five-day-forcast";
    for (var i = 0; i < 5; i++) {


        var dayCardEl = document.createElement("div");
        dayCardEl.classList = "day-card col-2";
        fiveDayForcastEl.appendChild(dayCardEl);

        //add date element
        var dateEl = document.createElement("h4");
        dateEl.textContent = moment().add(i + 1, 'days').format("MM/DD/YYYY");
        dayCardEl.appendChild(dateEl);

        //add weather icon
        var iconEl = document.createElement("img");
        var iconURL = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
        iconEl.src = iconURL;
        dayCardEl.appendChild(iconEl)

        //and day temp
        var dayTemp = document.createElement("p");
        dayTemp.textContent = "Temp: " + data.daily[i].temp.max + "°F";
        dayCardEl.appendChild(dayTemp);

        //add day wind
        var dayWind = document.createElement("p");
        dayWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        dayCardEl.appendChild(dayWind);

        //add day humidity
        var dayHumidity = document.createElement("p");
        dayHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
        dayCardEl.appendChild(dayHumidity);

        rightSideEl.appendChild(fiveDayForcastEl);

    }
}

var displayWeather = function (lat, lon, cityName) {
    //oneCall api
    var oneCallAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely&appid=" + apiKey;
    fetch(oneCallAPIUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        var todaysWeatherEl = document.createElement("div")
                        todaysWeatherEl.className = "search-results-today";
                        rightSideEl.appendChild(todaysWeatherEl);
                        console.log(moment().utc(data.current.dt).format("MM/DD/YYYY"));
                        var today = moment().utc(data.current.dt).format("MM/DD/YYYY");
                        var icon = data.current.weather[0].icon;
                        var iconUrl = "http://openweathermap.org/img/wn/" + icon + ".png";

                        //create Today's weather element
                        var cityDateEl = document.createElement("h2");
                        cityDateEl.className = "city-date";
                        cityDateEl.textContent = cityName + " (" + today + ")";


                        var iconEl = document.createElement("img");
                        iconEl.src = iconUrl;

                        cityDateEl.append(iconEl);

                        todaysWeatherEl.appendChild(cityDateEl);

                        //create Todays temp element
                        var tempEl = document.createElement("p");
                        tempEl.className = "";
                        tempEl.textContent = "Temp: " + data.current.temp + "°F";
                        todaysWeatherEl.appendChild(tempEl);

                        //create todays wind speed
                        var windSpeedEl = document.createElement("p");
                        windSpeedEl.className = "";
                        windSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
                        todaysWeatherEl.appendChild(windSpeedEl);

                        //create humidity element
                        var humidityEl = document.createElement("p");
                        humidityEl.className = "";
                        humidityEl.textContent = "Humidity: " + data.current.humidity + " %";
                        todaysWeatherEl.appendChild(humidityEl);

                        var uvIndexEl = document.createElement("p");
                        uvIndexEl.className = "";
                        uvIndexEl.textContent = "UV Index: " + data.current.uvi;
                        todaysWeatherEl.appendChild(uvIndexEl);

                        fiveDayForcast(data);
                        console.log(data);

                    });
                console.log("Connection successful!");
            }
            else {
                console.log("conneciton unsuccessful");
            }
        })
        .catch(function (error) {
            console.log("could not connect");
        })

};

var citySearch = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
    clearForm();
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data.list[0].weather[0].icon)
                        displayWeather(data.city.coord.lat, data.city.coord.lon, city);
                    });
                console.log("Connection successful!");
            }
            else {
                console.log("conneciton unsuccessful");
            }
        })
        .catch(function (error) {
            console.log("could not connect");
        })
}

$("#searchButton").on("click", function (event) {
    event.preventDefault();
    var searchText = $("#search-text").val();
    //get lat and lon to use in the one call api since it only uses lat and lon
    citySearch(searchText);
});

$(".city").on("click", function (event) {
    event.preventDefault();
    clearForm();
    var searchText = event.target.textContent;
    citySearch(searchText);
});