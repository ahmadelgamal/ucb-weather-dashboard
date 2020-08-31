/* -------------------- BEGINS GLOBAL VARIABLE DECLARATIONS -------------------- */
/* ---------- declares variables that represent referenced elements on site ---------- */
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
var currentUvIndexValueEl = document.querySelector("#current-uv-index-value");
var forecastCardsListEl = document.querySelector("#forecast-cards-list");

/* ---------- declares variables to store API URLs and Key ---------- */
// Current Weather API Path
var currentWeatherApiPath =
  "https://api.openweathermap.org/data/2.5/weather?q=";
// Forecast API Path
var forecastApiPath = "https://api.openweathermap.org/data/2.5/forecast?q=";
// UV Index Path
var uvIndexApiPath = "https://api.openweathermap.org/data/2.5/uvi?appid=";

// path to weather condition icons hosted by openweathermap.org
var iconPath = "https://openweathermap.org/img/wn/";

/* API Key acquired from https://openweathermap.org.
This is a security vulnerability.
API Keys should not be made public on GitHub because they can be stolen.
Should be removed and deleted from openweathermaps.org after assignment is graded. */
var openWeatherMapApiKey = "ec676b48ec83e5bd9439da43ceadf734";

/* ---------- declares other global variables ---------- */
// variable used to store the currentCity being searched
var currentCity;

/* declares global variables to store longitude and latitude of currentCity being searched.
This is needed to fetch data from "UV Index" API which only uses lat and lon (not cityName) */
var currentLat = 0;
var currentLon = 0;

// declares an empty array for the city search history list
var searchListArray = [];
/* -------------------- ENDS GLOBAL VARIABLE DECLARATIONS -------------------- */

/* -------------------- BEGINS EVENT HANDLERS -------------------- */
/* ---------- search-form event handler ---------- */
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

/* ---------- search-history list-items event handler ---------- */
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
var saveCity = function () {
  // Adds current city to beginning of search history
  searchListArray.unshift(currentCity);

  // removes other instance of current city from search history, if applicable
  for (var i = 1; i < searchListArray.length; i++) {
    if (searchListArray[i] == currentCity) {
      searchListArray.splice(i, 1);
    }
  }

  /* removes instance 9 (index 8) from search history list, if it reaches it
  this keeps it at a maximum of 8 in length for memory purposes */
  if (searchListArray.length == 9) {
    searchListArray.splice(8, 1);
  }

  // converts the array of searchList into a string to save to localStorage
  var searchListString = JSON.stringify(searchListArray);
  // saves string of search history to localStorage

  window.localStorage.setItem("citySearchListLS", searchListString);

  // calls function to reload search history from localStorage on save
  loadSearchList();
};
/* -------------------- ENDS LOCALSTORAGE -------------------- */

/* -------------------- BEGINS FETCH -------------------- */
/* ---------- writes today's current data from fetch reponse to html ---------- */
var displayCurrentWeather = function (data) {
  /* gets proper city name spelling as per openweathermap.org (OWM) database
  please note that there is a potential error, 
  because although OWM database has proper spelling,
  if you search for a city using the same proper spelling
  there is a chance that you may not find it, such as "Aswan" */
  currentCity = data.name;

  var currentEpochDate = new Date();
  var currentIcon = data.weather[0].icon;
  var currentTemperature = data.main.temp;
  var currentHumidity = data.main.humidity;
  var currentWindSpeed = data.wind.speed;
  /* ---------- decides type of weather condition for background color of UV Index ----------*/
  var currentWeatherConditions = data.weather[0].id;
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
  // gets date details from from epoch date
  var day = currentEpochDate.getDate();
  var month = currentEpochDate.getMonth() + 1; // Adds one because month returned by `getMonth()` method starts at 0 index!
  var year = currentEpochDate.getFullYear();
  // writes date in web-design format
  var currentDate = "(" + month + "/" + day + "/" + year + ")";
  /* ---------- updates city section with fetched data ---------- */
  cityNameEl.innerHTML = currentCity;
  currentDateEl.innerHTML = currentDate;
  currentIconEl.src = iconPath + currentIcon + ".png";
  currentTempEl.innerHTML = "Temperature: " + currentTemperature + " &#176;F";
  currentHumidityEl.innerHTML = "Humidity: " + currentHumidity + "%";
  currentWindSpeedEl.innerHTML = "Wind Speed: " + currentWindSpeed + " MPH";
};

/* ---------- gets uv index value from "UV Index" API ---------- */
var getCityUvIndex = function (currentLat, currentLon) {
  // sets UV Index API URL according to openweathermap.org specs
  var apiUrl =
    // host + path
    uvIndexApiPath +
    // personal API key
    openWeatherMapApiKey +
    // search using latitude and longitude of currentCity (acquired from Forecast API)
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
      // writes UV Index value to html (span) element
      currentUvIndexValueEl.innerHTML = currentUvIndex;
    })
    /* If fetch request was unsuccessful
    for a reason other than a value in the 400s,
    i.e. network errors, usually it's a value in the 500s */
    .catch(function (error) {
      searchErrorMessageEl.innerHTML =
        "Network error!<br />Unable to connect to get UV Index!<br />Please check internet connection.";
    });
};

/* ---------- gets weather info from "5 Day / 3 Hour Forecast" API ---------- */
var getForecastWeather = function (citySearchTerm) {
  // sets Forecast API URL according to openweathermap.org specs
  var apiUrl =
    // host + path + query
    forecastApiPath +
    // city
    citySearchTerm +
    // parameter: uses Imperial (Fahrenheit) temp instead of Kelvin
    "&units=imperial" +
    // parameter for API Key
    "&appid=" +
    openWeatherMapApiKey;

  // fetches data
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /* ---------- updates forecast section with fetched data ----------*/
      /* `for` loop sets data for each of the forecast cards.
      i increases by 8 each loop because data is every 3 hours and we want every 24 hours
      i < 40 because 40 divided by 8 equals 5 (days)
      i starts at 7 to allow 24 hours from current time */
      for (var i = 7; i < 40; i += 8) {
        var forecastEpochDate = new Date(data.list[i].dt * 1000);
        var forecastIcon = data.list[i].weather[0].icon;
        var forecastTemperature = data.list[i].main.temp;
        var forecastHumidity = data.list[i].main.humidity;

        // gets date from epoch date
        var day = forecastEpochDate.getDate();
        var month = forecastEpochDate.getMonth() + 1; // Adds one because month returned by `getMonth()` method starts at 0 index!
        var year = forecastEpochDate.getFullYear();
        // converts the epoch date into the web-design date format
        var forecastDate = month + "/" + day + "/" + year;

        /* ---------- creates a new forecast card and its elements ---------- */
        var forecastCardEl = document.createElement("li");

        var forecastDateEl = document.createElement("h4");
        forecastDateEl.innerText = forecastDate;
        forecastCardEl.appendChild(forecastDateEl);

        var forecastWeatherIconEl = document.createElement("img");
        forecastWeatherIconEl.src = iconPath + forecastIcon + ".png";
        forecastCardEl.appendChild(forecastWeatherIconEl);

        var forecastTempEl = document.createElement("p");
        forecastTempEl.className = "forecast-temp";
        forecastTempEl.innerHTML = "Temp: " + forecastTemperature + " &#176;F";
        forecastCardEl.appendChild(forecastTempEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + forecastHumidity + "%";
        forecastCardEl.appendChild(forecastHumidityEl);

        // appends forecast card to forecast cards list after having added all content
        forecastCardsListEl.appendChild(forecastCardEl);

        // displays right-column (which was set to `display: none` at first visit/refersh)
        rightColumnEl.style.display = "initial";
      }
    })
    /* If fetch request was unsuccessful
    for a reason other than a value in the 400s,
    i.e. network errors, usually it's a value in the 500s */
    .catch(function (error) {
      searchErrorMessageEl.innerHTML =
        "Network error!<br />Unable to connect to get weather forecast!<br />Please check internet connection.";
    });
};

/* ---------- gets weather info from all 3 APIs (chained) starting with "Current Weather Data" ---------- */
var getCityWeather = function (citySearchTerm) {
  /* ---------- resets begin ---------- */
  // resets seach-form input for every new search
  searchInputEl.value = "";

  // resets error message if no city was entered then it is entered
  searchErrorMessageEl.textContent = "";

  // resets forecast cards for every new search
  forecastCardsListEl.innerHTML = "";
  /* ---------- resets end ---------- */

  // sets Current Weather Data API URL according to openweathermap.org specs
  var apiUrl =
    // host + path + query
    currentWeatherApiPath +
    // city
    citySearchTerm +
    // parameter: uses Imperial (Fahrenheit) temp instead of Kelvin
    "&units=imperial" +
    // parameter: for API Key
    "&appid=" +
    openWeatherMapApiKey;

  // fetches API
  fetch(apiUrl)
    // returns the data in json readable format
    .then(function (response) {
      return response.json();
    })
    // calls function to write current weather from data
    .then(function (data) {
      // saves latitude and longitude of current-city to use it to fetch uv index data
      currentLat = data.coord.lat;
      currentLon = data.coord.lon;
      displayCurrentWeather(data);
    })
    // calls function to fetch new data for uv index
    .then(function () {
      getCityUvIndex(currentLat, currentLon);
    })
    // calls function to fetch new data for forecast weather
    .then(function () {
      getForecastWeather(citySearchTerm);
    })
    // calls function to save current city to search history list
    .then(function () {
      saveCity();
    })
    /* If fetch request was unsuccessful
    for a reason other than a value in the 400s,
    i.e. network errors, usually it's a value in the 500s */
    .catch(function (error) {
      searchErrorMessageEl.innerHTML =
        "Network error!<br />Unable to connect to get weather data!<br />Please check internet connection.";
    });
};
/* -------------------- ENDS FETCH -------------------- */

/* -------------------- BEGINS EVENT LISTENERS -------------------- */
/* ---------- event listener for search form ---------- */
searchFormEl.addEventListener("submit", searchFormHandler);
/* ---------- event listener for search history ---------- */
searchHistoryEl.addEventListener("click", searchHistoryHandler);
/* -------------------- ENDS EVENT LISTENERS -------------------- */
