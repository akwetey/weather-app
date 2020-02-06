import axios from "axios";
const apikey = "EGbDx8Ku6WQxGWpwkB4KoWZ95jEjfxxb";

const fetchData = async (url, apikey, city) => {
  try {
    const query = `?apikey=${apikey}&q=${city}`;
    const response = await axios.get(url + query);
    return await response.data;
  } catch {
    err => console.error(err);
  }
};

const submitFunc = e => {
  e.preventDefault();
  const city = document.querySelector("#cityName").value;
  fetchData(
    `http://dataservice.accuweather.com/locations/v1/cities/search`,
    apikey,
    city
  )
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));
};

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("form").addEventListener("submit", submitFunc);
});
