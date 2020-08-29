// declare variables to represent elements and buttons on site
var searchBtnEl = document.querySelector("#search-btn");
var searchInputEl = document.querySelector("#search-input");
var apiKey = "ec676b48ec83e5bd9439da43ceadf734";

// event handler for search button
var searchBtnClickHandler = function (event) {
  if (searchInputEl.value) {
    getCityWeather();
  } else {
    alert("Please enter a city name");
  }
};

// function to fetch api info
var getCityWeather = function () {
  event.preventDefault();
  var citySearchTerm = searchInputEl.value.trim();
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearchTerm +
    "&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
};

// Click event listener for search button
searchBtnEl.addEventListener("submit", searchBtnClickHandler);
