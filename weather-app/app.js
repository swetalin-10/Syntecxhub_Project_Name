const cityInput   = document.getElementById('cityInput');
const searchBtn   = document.getElementById('searchBtn');
const card        = document.getElementById('card');
const loader      = document.getElementById('loader');
const message     = document.getElementById('message');
const keyModal    = document.getElementById('keyModal');
const apiKeyInput = document.getElementById('apiKeyInput');

document.getElementById('settingsBtn').addEventListener('click', openKeyModal);
document.getElementById('saveKeyBtn').addEventListener('click', saveKey);
searchBtn.addEventListener('click', () => search());
cityInput.addEventListener('keydown', e => e.key === 'Enter' && search());

function getKey() { return localStorage.getItem('sc_api_key') || ''; }

function openKeyModal() {
  apiKeyInput.value = getKey();
  keyModal.classList.remove('hidden');
}

function saveKey() {
  const key = apiKeyInput.value.trim();
  if (!key) return;
  localStorage.setItem('sc_api_key', key);
  keyModal.classList.add('hidden');
  search();
}

async function search() {
  const city = cityInput.value.trim();
  if (!city) return;

  if (!getKey()) {
    openKeyModal();
    return;
  }

  showLoader();
  try {
    const data = await fetchWeather(city);
    localStorage.setItem('sc_last_city', city);
    renderWeather(data);
  } catch (err) {
    showMessage(err.message);
  }
}

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${getKey()}`;
  const res = await fetch(url);
  if (res.status === 401) throw new Error('Invalid API key. Click ⚙ to update it.');
  if (res.status === 404) throw new Error(`City "${city}" not found.`);
  if (!res.ok) throw new Error('Something went wrong. Please try again.');
  return res.json();
}

function renderWeather(data) {
  document.getElementById('city').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
  document.getElementById('icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°`;
  document.getElementById('condition').textContent = data.weather[0].description;
  document.getElementById('feels').textContent = `${Math.round(data.main.feels_like)}°`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

  loader.classList.add('hidden');
  message.classList.add('hidden');
  card.classList.remove('hidden');
}

function showLoader() {
  card.classList.add('hidden');
  message.classList.add('hidden');
  loader.classList.remove('hidden');
}

function showMessage(text) {
  loader.classList.add('hidden');
  card.classList.add('hidden');
  message.textContent = text;
  message.classList.remove('hidden');
}

const lastCity = localStorage.getItem('sc_last_city');
if (lastCity) {
  cityInput.value = lastCity;
  if (getKey()) search();
}
