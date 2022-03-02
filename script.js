const API_KEY = 'eca9d6950c16f4eaa25b0380f0938fd4';
const weatherApp = document.querySelector('#weather-app');
const cityName = weatherApp.querySelector(".weather-app__name");
const cityTemp = weatherApp.querySelector(".weather-app__temp");
const weatherStatus = weatherApp.querySelector(".weather-app__status");
const weatherIco = weatherApp.querySelector(".weather-app__ico");
const weatherTime = weatherApp.querySelector(".weather-app__time");
const cityWind = weatherApp.querySelector(".weather-app__wind");
const cityFeelsLike = weatherApp.querySelector(".weather-app__feels-like");
const cityPressure = weatherApp.querySelector(".weather-app__pressure");
const cityHumidity = weatherApp.querySelector(".weather-app__humidity");
const searchBtn = weatherApp.querySelector(".weather-app__btn");
const citySearch = weatherApp.querySelector(".weather-app__input");
const errorMessage = weatherApp.querySelector(".weather-app__error");

const convertToCelsius = (a) => {
  return Math.round(a - 273.15) + " °C";
};

const weatherInfo = (info) => {
  cityName.textContent = `${info.name}, ${info.sys.country}`;
  cityTemp.textContent = convertToCelsius(info.main.temp);
  weatherStatus.textContent = info.weather[0].description;
  weatherIco.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`
  );
  weatherTime.textContent = new Date().toLocaleDateString();
  
  cityFeelsLike.textContent = "Temperatura odczuwalna: " + convertToCelsius(info.main.feels_like);
  cityPressure.textContent = "Ciśnienie: " + info.main.pressure + " hPa";
  cityWind.textContent = "Siła wiatru: " + info.wind.speed + " m/s";
  cityHumidity.textContent = "Wigotność: " + info.main.humidity + " %";
};

const getWeatherBySearch = (city) => {
  const URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=pl`;
  fetch(URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((res) => weatherInfo(res))
    .catch((err) => (errorMessage.textContent = "Miasto nie istnieje"));
};

//Krok2: pobiermy informacje o pogodzie z naszej szerokości geograficznej i wywołujemy funkcję
//weatherInfo przekazując do niej odpowiedź z naszego fetch/then
const getWheaterByLocation = (coords) => {
  const URL = `http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&lang=pl`;
  fetch(URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((res) => weatherInfo(res))
    .catch((err) => (errorMessage.textContent = "Coś poszło nie tak. Spróbuj ponownie."));
};

//Krok1: uzyskanie informacji na temat współrzędnych geograficznych i 
//przekazanie ich do funkcji getWheaterByLocation, a następnie wywołanie jej
const getMyLocation = () => { 
  return navigator.geolocation.getCurrentPosition((position) => getWheaterByLocation(position.coords) );
};

const getSearchResult = () => {
  if (citySearch.value !== "") {
    errorMessage.textContent = "";
    return getWeatherBySearch(citySearch.value);
  } else {
    errorMessage.textContent = "Miasto nie może być puste.";
  }
};

getMyLocation();
searchBtn.addEventListener('click', getSearchResult);
