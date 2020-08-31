/* -------------------- BEGINS GLOBAL VARIABLE DECLARATIONS -------------------- */
/* ---------- declares variables that represent elements on site ---------- */
/* left-column elements */
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var searchErrorMessageEl = document.querySelector("#search-error-message");
var searchHistoryEl = document.querySelector("#search-history");

/* right-column elements */
var rightColumnEl = document.querySelector(".right-column");
var cityNameEl = document.querySelector("#city-name");
var currentDateEl = document.querySelector("#current-date");
var currentIconEl = document.querySelector("#current-weather-icon");
var currentTempEl = document.querySelector("#current-temperature");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentUvIndexEl = document.querySelector("#current-uv-index");
var currentUvIndexValueEl = document.querySelector("#current-uv-index-value");
var forecastCardsListEl = document.querySelector("#forecast-cards-list");

/* ---------- declares other global variables ---------- */
/* API Key acquired from https://openweathermap.org.
This is a security vulnerability.
API Keys should not be made public on GitHub because they can be stolen.
Should be removed and deleted from openweathermaps after assignment is graded. */
var forecastApiKey = "ec676b48ec83e5bd9439da43ceadf734";

/* declares global variables to store longitude and latitude of currentCity being searched.
This is needed to fetch data from "UV Index" API which only uses lat and lon */
var currentLat = 0;
var currentLon = 0;

// declares an empty array for the city search list
var searchListArray = [];
/* -------------------- ENDS GLOBAL VARIABLE DECLARATIONS -------------------- */

/* -------------------- BEGINS EVENT HANDLERS -------------------- */
/* ---------- event handler for search-form ---------- */
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

/* ---------- event handler for search-history list items ---------- */
var searchHistoryHandler = function (event) {
  event.preventDefault();
  var citySearchTerm = event.target.textContent;
  getCityWeather(citySearchTerm);
};
/* -------------------- ENDS EVENT HANDLERS -------------------- */

/* -------------------- BEGINS LOCALSTORAGE -------------------- */
/* ---------- loads search history from localStorage ---------- */
var loadSearchList = function (citySearchList) {
  // loads search history list from locaStorage
  var loadedSearchList = window.localStorage.getItem("citySearchListLS");

  // checks to see is there is an existing search history list
  if (loadedSearchList) {
    // resets the search history element on first visit and refresh in order to rewrite it from localStorage
    searchHistoryEl.innerHTML = "";

    // parses the search list loaded from localStorage into an array instead of a string
    loadedSearchList = JSON.parse(loadedSearchList);

    // creates a list item for each city in search history and appends it to the search history list
    for (i = 0; i < loadedSearchList.length; i++) {
      var searchHistoryItemEl = document.createElement("li");
      searchHistoryItemEl.innerHTML = loadedSearchList[i];
      searchHistoryEl.appendChild(searchHistoryItemEl);
    }

    // saves the loaded search list to the global array `searchListArray` in order to use it in `saveCity` function
    searchListArray = loadedSearchList;
  }
};

// calls function to load search history from localStorage on first visit and refersh
loadSearchList();

/* ---------- saves search history list to localStorage ---------- */
// saves currentCity to search history
var saveCity = function (currentCity) {
  // Adds current city to beginning of search history
  searchListArray.unshift(currentCity);

  // removes other instance of current city from search history
  for (var i = 1; i < searchListArray.length; i++) {
<<<<<<< HEAD
    // for (var i = 1; i < 8 && i < searchListArray.length; i++) {
=======
>>>>>>> develop
    if (searchListArray[i] == currentCity) {
      searchListArray.splice(i, 1);
    }
  }

<<<<<<< HEAD
  // removes instance 9 (index 8) from search history list to keep it always 8 in length for memory purposess
=======
  // removes instance 9 (index 8) from search history list to keep it always 8 in length for memory purposes
>>>>>>> develop
  if (searchListArray.length == 9) {
    searchListArray.splice(8, 1);
  }

<<<<<<< HEAD
  // changes array to string to save to localStorage
=======
  // converts the array of searchList into a string to save to localStorage
>>>>>>> develop
  var searchListString = JSON.stringify(searchListArray);
  // saves string of search history to localStorage
  window.localStorage.setItem("citySearchListLS", searchListString);

  // calls function to reload search history from localStorage on save
  loadSearchList();
};
/* -------------------- ENDS LOCALSTORAGE -------------------- */

/* -------------------- BEGINS FETCH -------------------- */
/* ---------- gets uv index value from "UV Index" API ---------- */
var getCityUvIndex = function (currentLat, currentLon) {
  // sets API URL
  var apiUrl =
<<<<<<< HEAD
    // host + path + query
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
=======
    // host + path
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
>>>>>>> develop
    // personal API key
    forecastApiKey +
    // search using latitude and longitude of currentCity (acquired from other API)
    "&lat=" +
    currentLat +
    "&lon=" +
    currentLon;

  // fetches data
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // gets UV Index from data
      var currentUvIndex = data.value;
      // writes UV Index value to html element
      currentUvIndexValueEl.innerHTML = currentUvIndex;
    });
};

/* ---------- gets weather info from "5 Day / 3 Hour Forecast" API ---------- */
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
    forecastApiKey;

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

      // decides type of weather condition for background color of UV Index
      var currentWeatherConditions = data.list[0].weather[0].id;
      // For favorable weather conditions
      if (
        currentWeatherConditions == 701 ||
        currentWeatherConditions == 721 ||
        currentWeatherConditions == 800 ||
        currentWeatherConditions == 801 ||
        currentWeatherConditions == 802 ||
        currentWeatherConditions == 803 ||
        currentWeatherConditions == 804
      ) {
        currentUvIndexValueEl.style.backgroundColor = "green";
        currentUvIndexValueEl.style.color = "#ffffff";
        // For moderate weather conditions
      } else if (
        currentWeatherConditions == 300 ||
        currentWeatherConditions == 301 ||
        currentWeatherConditions == 302 ||
        currentWeatherConditions == 311 ||
        currentWeatherConditions == 500 ||
        currentWeatherConditions == 501 ||
        currentWeatherConditions == 600 ||
        currentWeatherConditions == 601 ||
        currentWeatherConditions == 612 ||
        currentWeatherConditions == 615 ||
        currentWeatherConditions == 620 ||
        currentWeatherConditions == 731 ||
        currentWeatherConditions == 741
      ) {
        currentUvIndexValueEl.style.backgroundColor = "yellow";
        currentUvIndexValueEl.style.color = "#000000";
        // For severe weather conditions
      } else if (
        currentWeatherConditions == 200 ||
        currentWeatherConditions == 201 ||
        currentWeatherConditions == 202 ||
        currentWeatherConditions == 210 ||
        currentWeatherConditions == 211 ||
        currentWeatherConditions == 212 ||
        currentWeatherConditions == 221 ||
        currentWeatherConditions == 230 ||
        currentWeatherConditions == 231 ||
        currentWeatherConditions == 232 ||
        currentWeatherConditions == 312 ||
        currentWeatherConditions == 313 ||
        currentWeatherConditions == 314 ||
        currentWeatherConditions == 321 ||
        currentWeatherConditions == 502 ||
        currentWeatherConditions == 503 ||
        currentWeatherConditions == 504 ||
        currentWeatherConditions == 511 ||
        currentWeatherConditions == 520 ||
        currentWeatherConditions == 521 ||
        currentWeatherConditions == 522 ||
        currentWeatherConditions == 531 ||
        currentWeatherConditions == 602 ||
        currentWeatherConditions == 611 ||
        currentWeatherConditions == 613 ||
        currentWeatherConditions == 616 ||
        currentWeatherConditions == 621 ||
        currentWeatherConditions == 622 ||
        currentWeatherConditions == 711 ||
        currentWeatherConditions == 751 ||
        currentWeatherConditions == 761 ||
        currentWeatherConditions == 762 ||
        currentWeatherConditions == 771 ||
        currentWeatherConditions == 781
      ) {
        currentUvIndexValueEl.style.backgroundColor = "#dc3545"; //red color
        currentUvIndexValueEl.style.color = "#ffffff";
        // For unknown weather conditions
      } else {
        currentUvIndexValueEl.style.backgroundColor = "#000000"; // black color
        currentUvIndexValueEl.style.color = "#ffffff";
      }

      // saves latitude and longitude of current-city to use it to fetch uv index data
      currentLat = data.city.coord.lat;
      currentLon = data.city.coord.lon;

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
        forecastWeatherIconEl.src =
          "https://openweathermap.org/img/wn/" + forecastIcon + ".png";
        forecastCardEl.appendChild(forecastWeatherIconEl);

        var forecastTempEl = document.createElement("p");
        forecastTempEl.className = "forecast-temp";
        forecastTempEl.innerHTML = "Temp: " + forecastTemperature + " &#176;F";
        forecastCardEl.appendChild(forecastTempEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + forecastHumidity + "%";
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
    })
    .then(function () {
      getCityUvIndex(currentLat, currentLon);
    });
};
/* -------------------- ENDS FETCH -------------------- */

/* -------------------- BEGINS EVENT LISTENERS -------------------- */
/* ---------- event listener for search form ---------- */
searchFormEl.addEventListener("submit", searchFormHandler);
/* ---------- event listener for search history ---------- */
searchHistoryEl.addEventListener("click", searchHistoryHandler);
/* -------------------- ENDS EVENT LISTENERS -------------------- */
