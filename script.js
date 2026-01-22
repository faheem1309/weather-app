const button = document.getElementById('getWeatherBtn');
const input = document.getElementById('cityInput');
const result = document.getElementById('weatherResult');

const API_KEY = 'f59cad1b55f59bd1a5fd484c863baad6';

button.addEventListener('click', () => {
  const city = input.value.trim();

  if (city === '') {
    result.innerText = 'Please enter a city name.';
    return;
  }

  result.innerText = 'Fetching weather...';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      result.innerHTML = `
        <p><strong>${data.name}, ${data.sys.country}</strong></p>
        <p>🌡 Temperature: ${data.main.temp} °C</p>
        <p>☁ Weather: ${data.weather[0].description}</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
      `;
    })
    .catch(error => {
      result.innerText = error.message;
    });
});
