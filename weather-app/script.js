document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-input");
  const locationElement = document.querySelector(".location");
  const dateElement = document.querySelector(".date");
  const temperatureElement = document.querySelector(".temperature");
  const weatherIconElement = document.querySelector(".weather-icon");
  const weatherDescriptionElement = document.querySelector(
    ".weather-description",
  );
  const humidityValueElement = document.querySelector(
    ".humidity .detail-value",
  );
  const windValueElement = document.querySelector(".wind .detail-value");
  const pressureValueElement = document.querySelector(
    ".pressure .detail-value",
  );

  // Update date
  function updateDate() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateElement.textContent = now.toLocaleDateString("id-ID", options);
  }

  updateDate();

  // Mock weather data (in a real app, you would fetch this from a weather API)
  const mockWeatherData = {
    jakarta: {
      location: "Jakarta, Indonesia",
      temperature: 28,
      icon: "fa-sun",
      description: "Cerah",
      humidity: "65%",
      wind: "10 km/jam",
      pressure: "1010 hPa",
    },
    bandung: {
      location: "Bandung, Indonesia",
      temperature: 22,
      icon: "fa-cloud",
      description: "Berawan",
      humidity: "75%",
      wind: "8 km/jam",
      pressure: "1008 hPa",
    },
    surabaya: {
      location: "Surabaya, Indonesia",
      temperature: 31,
      icon: "fa-sun",
      description: "Cerah",
      humidity: "60%",
      wind: "12 km/jam",
      pressure: "1012 hPa",
    },
    yogyakarta: {
      location: "Yogyakarta, Indonesia",
      temperature: 26,
      icon: "fa-cloud-sun",
      description: "Cerah Berawan",
      humidity: "70%",
      wind: "9 km/jam",
      pressure: "1009 hPa",
    },
  };

  // Search functionality
  searchButton.addEventListener("click", searchWeather);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchWeather();
    }
  });

  function searchWeather() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
      showError("Silakan masukkan nama kota");
      return;
    }

    // Show loading state
    locationElement.textContent = "Mencari...";
    weatherIconElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // Simulate API call with timeout
    setTimeout(() => {
      if (mockWeatherData[query]) {
        const data = mockWeatherData[query];
        updateWeatherData(data);
      } else {
        showError(
          "Kota tidak ditemukan. Coba Jakarta, Bandung, Surabaya, atau Yogyakarta",
        );
      }
    }, 1000);
  }

  function updateWeatherData(data) {
    locationElement.textContent = data.location;
    temperatureElement.innerHTML = `${data.temperature}<span>°C</span>`;
    weatherIconElement.innerHTML = `<i class="fas ${data.icon}"></i>`;
    weatherDescriptionElement.textContent = data.description;
    humidityValueElement.textContent = data.humidity;
    windValueElement.textContent = data.wind;
    pressureValueElement.textContent = data.pressure;
  }

  function showError(message) {
    // Remove any existing error
    const existingError = document.querySelector(".error");
    if (existingError) {
      existingError.remove();
    }

    const errorElement = document.createElement("div");
    errorElement.className = "error";
    errorElement.innerHTML = `<p><i class="fas fa-exclamation-circle"></i> ${message}</p>`;

    document.querySelector(".search-container").appendChild(errorElement);

    // Reset after 3 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  }
});
