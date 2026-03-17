const API_KEY = "785f679109a20120558e8ac45f7c6f3c";

const form = document.querySelector("#form");
const cityInput = document.querySelector("#city");
const weatherDetails = document.querySelector(".weather-details");
const historyBtn = document.querySelector(".historyBtn");
const consoleOutput = document.querySelector(".console-output");

let logCount = 0;

window.addEventListener("load", displayHistory);

function logLine(message, type) {
  const line = document.createElement("div");
  line.classList.add("log-line");

  if (type === "async") {
    line.classList.add("async-line");
    line.textContent = message;
  } else {
    logCount++;

    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = logCount;

    if (type === "sync") {
      badge.classList.add("orange");
    } else {
      badge.classList.add("blue");
    }

    const text = document.createElement("span");
    text.textContent = message;

    line.appendChild(badge);
    line.appendChild(text);
  }

  consoleOutput.appendChild(line);
}

async function fetchWeather(city) {
  consoleOutput.innerHTML = "";
  logCount = 0;
  weatherDetails.innerHTML = `<p>Loading weather data...</p>`;
  logLine("Sync Start", "sync");
  logLine("Sync End", "sync");
  logLine("[ASYNC] Start fetching", "async");
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await res.json().then((d) => {
      logLine("Promise.then (Microtask)", "micro");
      return d;
    });

    setTimeout(() => {
      logLine("setTimeout (Macrotask)", "macro");
    }, 0);

    logLine("[ASYNC] Data received", "async");
    if (data.cod === 200) {
      weatherDetails.innerHTML = `
        <div class="weather-row">
          <span>City</span>
          <span>${data.name}, ${data.sys.country}</span>
        </div>
        <div class="weather-row">
          <span>Temp</span>
          <span>${(data.main.temp - 273.15).toFixed(2)} °C</span>
        </div>
        <div class="weather-row">
          <span>Weather</span>
          <span>${data.weather[0].main}</span>
        </div>
        <div class="weather-row">
          <span>Humidity</span>
          <span>${data.main.humidity}%</span>
        </div>
        <div class="weather-row">
          <span>Wind</span>
          <span>${data.wind.speed} m/s</span>
        </div>
      `;
      const prev = JSON.parse(localStorage.getItem("cityHistory")) || [];
      const updated = [...new Set([...prev, city])];
      localStorage.setItem("cityHistory", JSON.stringify(updated));
      displayHistory();
    } else {
      weatherDetails.innerHTML = `<p class="error-msg">City not found</p>`;
    }

  } catch (error) {
    weatherDetails.innerHTML = `<p class="error-msg">Network error. Try again.</p>`;
    logLine("[ERROR] Request failed", "async");
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
  cityInput.value = "";
});

function displayHistory() {
  historyBtn.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("cityHistory")) || [];
  history.forEach((city) => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.classList.add("pill");
    btn.addEventListener("click", () => {
      cityInput.value = city;
      fetchWeather(city);
    });
    historyBtn.appendChild(btn);

  });
}



// API_KEY
// https://api.openweathermap.org/data/2.5/weather?q=goa&appid=785f679109a20120558e8ac45f7c6f3c



// command for removing cities from the history , have to type this command in console - 
// localStorage.removeItem("cityHistory")