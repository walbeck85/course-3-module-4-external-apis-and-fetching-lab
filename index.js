// index.js

// -------------------- Step 1: Fetch Weather Data from OpenWeather API --------------------
async function fetchWeatherData(city) {
  toggleLoading(true); // Show loading spinner
  try {
    const apiKey = 'f7c12cc34b1af4113ffb79de9670cb0b';
    
    // Construct API request using city input and metric units
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    // Handle unsuccessful responses
    if (!response.ok) {
      throw new Error(`City not found: ${city}`);
    }

    // Parse and return JSON data
    const data = await response.json();
    console.log(data); // Log for testing
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  } finally {
    toggleLoading(false); // Hide loading spinner
  }
}

// -------------------- Step 2: Display Weather Data in the DOM --------------------
function displayWeather(data) {
  const weatherDiv = document.getElementById("weather-display");

  // Update weather display element with API values
  weatherDiv.innerHTML = `
    <h2>Weather in ${data.name}</h2>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Condition: ${data.weather[0].description}</p>
  `;
  toggleVisibility("error-message", false);
}

// -------------------- Step 3: Handle User Input and Fetch Trigger --------------------
document.addEventListener("DOMContentLoaded", () => {
  const fetchButton = document.getElementById("fetch-weather");

  fetchButton.addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();

    if (city) {
      fetchWeatherData(city)
        .then(displayWeather)
        .catch((error) => {
          displayError(error.message);
        });
    } else {
      console.error("Please enter a city name.");
    }
  });
});

// -------------------- Step 4: Display Error Message in the DOM --------------------
function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  toggleVisibility("error-message", true);
  clearElementContent("weather-display");
}

// -------------------- Utility: Show/Hide Loading Indicator --------------------
function toggleLoading(isLoading) {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.classList.toggle("hidden", !isLoading);
  }
}

// -------------------- Utility: Clear Content of a DOM Element --------------------
function clearElementContent(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = "";
  }
}

// -------------------- Utility: Toggle Element Visibility --------------------
function toggleVisibility(elementId, shouldShow) {
  const element = document.getElementById(elementId);
  if (!element) return; // Prevent test crash if element doesn't exist

  if (shouldShow) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

// -------------------- Export Functions for Jest Tests --------------------
module.exports = {
  fetchWeatherData,
  displayWeather,
  displayError,
};