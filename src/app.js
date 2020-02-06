import axios from "axios";
const apikey = "EGbDx8Ku6WQxGWpwkB4KoWZ95jEjfxxb";
const card = document.querySelector(".card");
const details = document.querySelector(".citydetails");
const image = document.querySelector("#weatherimg");
const icon = document.querySelector(".icon img");

//get current condition
const currentCondition = async (url, apikey) => {
  try {
    const query = `?apikey=${apikey}`;
    const response = await axios.get(url + query);
    return await response.data[0];
  } catch {
    err => console.error(err);
  }
};

//get city location
const cityData = async (url, apikey, city) => {
  try {
    const query = `?apikey=${apikey}&q=${city}`;
    const response = await axios.get(url + query);
    return await response.data[0];
  } catch {
    err => console.error(err);
  }
};

//update ui
const updateUi = async (response, details, card, image, icon) => {
  const { cityDetails, weatherDetails } = response;

  //update DOM
  details.innerHTML = `<h4 class="my-3">${cityDetails.EnglishName}</h4>
          <div class="my-3">${weatherDetails.WeatherText}</div>
          <div class="display-4 my-4">
            <span>${weatherDetails.Temperature.Metric.Value}</span>
            <span>&deg; C</span>
          </div`;
  card.style.display = "block";

  /**update image and icon */
  let img = null;
  if (weatherDetails.IsDayTime) {
    img = "../img/day.svg";
  } else {
    img = "../img/night.svg";
  }
  image.setAttribute("src", img);

  const iconSrc = `../img/icons/${weatherDetails.WeatherIcon}.svg`;
  icon.setAttribute("src", iconSrc);
};

const fetchDetails = async city => {
  const cityDetails = await cityData(
    `http://dataservice.accuweather.com/locations/v1/cities/search`,
    apikey,
    city
  );
  const { Key } = cityDetails;
  const weatherDetails = await currentCondition(
    `http://dataservice.accuweather.com/currentconditions/v1/${Key}`,
    apikey
  );
  return {
    cityDetails: cityDetails,
    weatherDetails: weatherDetails
  };
};

const checkItem = localStorage.getItem("location");
if (checkItem) {
  fetchDetails(checkItem)
    .then(response => {
      updateUi(response, details, card, image, icon);
    })
    .catch(err => console.log(err));
}

const submitFunc = e => {
  e.preventDefault();
  const city = document.querySelector("#cityName").value.trim();
  fetchDetails(city)
    .then(response => {
      updateUi(response, details, card, image, icon);
    })
    .catch(err => console.log(err));

  //local storage
  localStorage.setItem("location", city);
};

document.addEventListener("DOMContentLoaded", function() {
  const weatherForm = document.querySelector("form");
  weatherForm.addEventListener("submit", submitFunc);
  weatherForm.reset();
});
