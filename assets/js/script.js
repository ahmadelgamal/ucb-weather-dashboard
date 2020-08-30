// declares variables to represent elements and buttons on site
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var searchErrorMessageEl = document.querySelector("#search-error-message");
var cityListEl = document.querySelector("#city-list");
var rightColumnEl = document.querySelector(".right-column");
var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#current-date");
var currentIconEl = document.querySelector("#current-weather-icon");
var currentTempEl = document.querySelector("#current-temperature");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentUvIndexEl = document.querySelector("#current-uv-index");
var forecastCardsListEl = document.querySelector("#forecast-cards-list");

// API Key acquired from https://openweathermap.org (One Call API)
var apiKey = "ec676b48ec83e5bd9439da43ceadf734";

// event handler for search-form
var searchFormHandler = function (event) {
  event.preventDefault();
  var citySearchTerm = searchInputEl.value.trim();
  if (citySearchTerm) {
    getCityWeather(citySearchTerm);

    // error message if no city is entered
  } else {
    searchErrorMessageEl.textContent = "Please enter a city name";
  }
};

// event handler for search-form
var cityListHandler = function (event) {
  event.preventDefault();
  var citySearchTerm = event.target.textContent;
  getCityWeather(citySearchTerm);
};

// declares an empty array for the city search list
var searchListArray = [];

// // loads city list from localStorage
// // only last 8 cities will load
var loadSearchList = function (citySearchList) {
  var loadedSearchList = window.localStorage.getItem("citySearchListLS");
  if (loadedSearchList) {
    cityListEl.innerHTML = "";
    loadedSearchList = JSON.parse(loadedSearchList);
    for (i = 0; i < loadedSearchList.length && i < 8; i++) {
      var cityListItemEl = document.createElement("li");
      cityListItemEl.innerHTML = loadedSearchList[i];
      cityListEl.appendChild(cityListItemEl);
    }
    searchListArray = loadedSearchList;
  }
};

// calls function to load search history from localStorage on refersh
loadSearchList();

// saves searched cities to city list
var saveCity = function (currentCity) {
  searchListArray.unshift(currentCity);
  var searchListString = JSON.stringify(searchListArray);
  window.localStorage.setItem("citySearchListLS", searchListString);
  loadSearchList();
};

// gets api info
var getCityWeather = function (citySearchTerm) {
  // resets seach-form input for every new search
  searchInputEl.value = "";

  // resets error message if no city is entered then it is entered
  searchErrorMessageEl.textContent = "";

  // resets forecast cards for every new search
  forecastCardsListEl.innerHTML = "";

  // sets API URL
  var apiUrl =
    // host + path + query
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    // city
    citySearchTerm +
    // uses Imperial (Fahrenheit) temp instead of Kelvin
    "&units=imperial" +
    "&appid=" +
    apiKey;

  // fetches API
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // declares variables to hold data from fetch reponse
      var currentCity = data.city.name;
      var currentEpochDate = new Date(data.list[0].dt * 1000);
      var currentIcon = data.list[0].weather[0].icon;
      var currentTemperature = data.list[0].main.temp;
      var currentHumidity = data.list[0].main.humidity;
      var currentWindSpeed = data.list[0].wind.speed;
      // var currentUvIndex = data.list[0].wind.speed;

      // gets date details from from epoch date
      var day = currentEpochDate.getDate();
      var month = currentEpochDate.getMonth() + 1; // Adds one because month returned by `getMonth()` method starts at 0 index!
      var year = currentEpochDate.getFullYear();
      // writes date in web-design format
      var currentDate = "(" + month + "/" + day + "/" + year + ")";

      // updates city section with fetched data
      cityNameEl.innerHTML = currentCity;
      currentDateEl.innerHTML = currentDate;
      currentIconEl.src =
        "https://openweathermap.org/img/wn/" + currentIcon + ".png";
      currentTempEl.innerHTML =
        "Temperature: " + currentTemperature + " &#176;F";
      currentHumidityEl.innerHTML = "Humidity: " + currentHumidity + "%";
      currentWindSpeedEl.innerHTML = "Wind Speed: " + currentWindSpeed + " MPH";
      currentUvIndexEl.innerHTML = "UV Index: get UV API";

      // updates forecast section with fetched data
      // for loop sets data for each of the forecast cards
      // increases i by 8 each loop because data is every 3 hours and we want every 24 hours
      // i < 40 because 40/8 = 5 (days)
      for (var i = 1; i < 40; i += 8) {
        var forecastEpochDate = new Date(data.list[i].dt * 1000);
        var forecastIcon = data.list[i].weather[0].icon;
        var forecastTemperature = data.list[i].main.temp;
        var forecastHumidity = data.list[i].main.humidity;

        // gets date from epoch date
        var day = forecastEpochDate.getDate();
        var month = forecastEpochDate.getMonth() + 1; // Adds one because month returned by `getMonth()` method starts at 0 index!
        var year = forecastEpochDate.getFullYear();
        // converts the epoch date into the web-design format
        var forecastDate = month + "/" + day + "/" + year;

        // creates a new forecast card and its elements
        var forecastCardEl = document.createElement("li");

        var forecastDateEl = document.createElement("h4");
        forecastDateEl.innerText = forecastDate;
        forecastCardEl.appendChild(forecastDateEl);

        var forecastWeatherIconEl = document.createElement("img");
        // forecastWeatherIconEl.src = "https://openweathermap.org/img/w/" + currentIcon + ".png";
        forecastWeatherIconEl.src =
          "https://openweathermap.org/img/wn/" + currentIcon + ".png";
        forecastCardEl.appendChild(forecastWeatherIconEl);

        var forecastTempEl = document.createElement("p");
        forecastTempEl.className = "forecast-temp";
        forecastTempEl.innerHTML = "Temp: " + currentTemperature + " &#176;F";
        forecastCardEl.appendChild(forecastTempEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + currentHumidity + "%";
        forecastCardEl.appendChild(forecastHumidityEl);

        // appends forecast card to forecast cards list after having adding all content
        forecastCardsListEl.appendChild(forecastCardEl);

        // displays right-column
        rightColumnEl.style.display = "initial";
      }
      return currentCity;
    })
    .then(function (currentCity) {
      saveCity(currentCity);
    });
};

// event listener for search form
searchFormEl.addEventListener("submit", searchFormHandler);
// event listener for search history
cityListEl.addEventListener("click", cityListHandler);
