const button = document.getElementById('getWeatherBtn');
const input = document.getElementById('cityInput');
const result = document.getElementById('weatherResult');
const loader = document.getElementById('loader');
const toggleUnitBtn = document.getElementById('toggleUnit');
const recentDiv = document.getElementById('recent');

const API_KEY = 'f59cad1b55f59bd1a5fd484c863baad6';

let unit = 'metric';

loadRecent();

button.addEventListener('click', getWeather);

toggleUnitBtn.addEventListener('click', () => {
  unit = unit === 'metric' ? 'imperial' : 'metric';
  toggleUnitBtn.innerText = unit === 'metric' ? '°C' : '°F';
});

function getWeather() {
  const city = input.value.trim();
  if (!city) {
    result.innerText = 'Please enter a city name.';
    return;
  }

  loader.classList.remove('hidden');
  result.innerHTML = '';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error('City not found');
      return res.json();
    })
    .then(data => {
      displayWeather(data);
      saveRecent(data.name);
      setBackground(data.weather[0].main);
    })
    .catch(err => {
      result.innerText = err.message;
    })
    .finally(() => loader.classList.add('hidden'));
}

function displayWeather(data) {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const icon = data.weather[0].icon;

  result.innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
    <p>🌡️ ${data.main.temp} ${tempUnit}</p>
    <p>☁️ ${data.weather[0].description}</p>
    <p>💨 Wind: ${data.wind.speed}</p>
  `;
}

function setBackground(condition) {
  document.body.className = '';
  if (condition.includes('Clear')) document.body.classList.add('sunny');
  else if (condition.includes('Rain')) document.body.classList.add('rainy');
  else if (condition.includes('Snow')) document.body.classList.add('cold');
}

function saveRecent(city) {
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  if (!cities.includes(city)) {
    cities.unshift(city);
    cities = cities.slice(0, 3);
    localStorage.setItem('cities', JSON.stringify(cities));
  }
  loadRecent();
}

function loadRecent() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];
  recentDiv.innerHTML = cities.length ? `Recent: ${cities.join(', ')}` : '';
}
