// declare variables to represent elements and buttons on site
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#current-date");
var currentIconEl = document.querySelector("#current-weather-icon");
var currentTempEl = document.querySelector("#current-temperature");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentUvIndexEl = document.querySelector("#current-uv-index");
var forecastCardEl = document.querySelector("#forecast-card");

// API Key acquired from https://openweathermap.org (One Call API)
var apiKey = "ec676b48ec83e5bd9439da43ceadf734";

// event handler for search-form
var searchFormHandler = function (event) {
  event.preventDefault();
  var citySearchTerm = searchInputEl.value.trim();
  if (citySearchTerm) {
    getCityWeather(citySearchTerm);
    // saveCity();

    // reset seach-form input
    citySearchTerm.value = "";

    // error message if no city is entered
  } else {
    var searchErrorMessageEl = document.createElement("p");
    searchErrorMessageEl.innerText = "Please enter a city name";
    searchFormEl.appendChild(searchErrorMessageEl);
  }
};

// function to fetch api info
var getCityWeather = function (citySearchTerm) {
  var apiUrl =
    // host + path + query
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    // city
    citySearchTerm +
    // use Imperial (Fahrenheit) temp instead of Kelvin
    "&units=imperial" +
    "&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var currentCity = data.city.name;
      var currentEpochDate = new Date(data.list[0].dt * 1000);
      var currentIcon = data.list[0].weather[0].icon;
      var currentTemperature = data.list[0].main.temp;
      var currentHumidity = data.list[0].main.humidity;
      var currentWindSpeed = data.list[0].wind.speed;
      // var currentUvIndex = data.list[0].wind.speed;

      // get date from epoch date
      var day = currentEpochDate.getDate();
      var month = currentEpochDate.getMonth(); // there's an error in the month!
      var year = currentEpochDate.getFullYear();
      // convert the epoch date into the web-design format
      var currentDate = "(" + month + "/" + day + "/" + year + ")";

      cityNameEl.innerHTML = currentCity;
      currentDateEl.innerHTML = currentDate;
      currentIconEl.src =
        "https://openweathermap.org/img/w/" + currentIcon + ".png";
      currentTempEl.innerHTML =
        "Temperature: " + currentTemperature + " &#176;F";
      currentHumidityEl.innerHTML = "Humidity: " + currentHumidity + "%";
      currentWindSpeedEl.innerHTML = "Wind Speed: " + currentWindSpeed + " MPH";
      currentUvIndexEl.innerHTML = "UV Index: get UV API";

      for (var i = 1; i < 6; i++) {
        var forecastEpochDate = new Date(data.list[i].dt * 1000);
        var forecastIcon = data.list[i].weather[0].icon;
        var forecastTemperature = data.list[i].main.temp;
        var forecastHumidity = data.list[i].main.humidity;

        // get date from epoch date
        var day = forecastEpochDate.getDate();
        var month = forecastEpochDate.getMonth(); // there's an error in the month!
        var year = forecastEpochDate.getFullYear();
        // convert the epoch date into the web-design format
        var forecastDate = month + "/" + day + "/" + year;

        
        var forecastListItemEl = document.createElement("li");
        // forecastListItemEl.classList.add("forecast-list-item", "forecast card");
        
        var forecastDateEl = document.createElement("h4");
        forecastDateEl.innerText = forecastDate;
        forecastListItemEl.appendChild(forecastDateEl);

        var forecastWeatherIconEl = document.createElement("img");
        forecastWeatherIconEl.src = "https://openweathermap.org/img/w/" + currentIcon + ".png";;
        forecastListItemEl.appendChild(forecastWeatherIconEl);
        
        var forecastTempEl = document.createElement("p");
        forecastTempEl.className = "forecast-temp";
        forecastTempEl.innerHTML =
        "Temp: " + currentTemperature + " &#176;F";
        forecastListItemEl.appendChild(forecastTempEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + currentHumidity + "%";
        forecastListItemEl.appendChild(forecastHumidityEl);
        
        // append forecast list item to forecast list after having adding all content
        forecastCardEl.appendChild(forecastListItemEl);
        console.log(forecastCardEl);
      }
    });
};

// var todaysDate = valueOf(new Date);

// event listener for search form
searchFormEl.addEventListener("submit", searchFormHandler);
