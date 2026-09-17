//  LIFE Modular Pattern
(function() {
    // <---------- DOM Element ---------->
    const searchBox = document.querySelector("input")
    const locationEl = document.querySelector(".location")
    const temp = document.querySelector(".temp")
    const descriptionEl = document.querySelector(".description")
    const feelsLikeEl = document.querySelector(".feels-like")
    const dateEl = document.querySelector(".date")
    const windSpeedEl = document.querySelector(".wind-speed span")
    const pressureEl = document.querySelector(".pressure span")
    const humidityEl = document.querySelector(".humidity span")
    const visibilityEl = document.querySelector(".visibility span")
    const errorMessage = document.querySelector(".error-message")
    const errorText = document.querySelector(".error-text")

    // <----------Variables---------->

    // URL From OpenWeatherMap
    const apiKey = {
        base: "https://api.openweathermap.org/data/2.5/weather?q=",
        default: "&appid=b9eccd74961cc7d812d853e74e272576&units=metric"
    }

    // All Backgrounds of Weather
    const backgrounds = {
        Clear: "url('./images/clear.jpg')",
        Clouds: "url('./images/clouds.jpg')",
        Rain: "url('./images/rain.jpg')",
        Drizzle: "url('./images/rain.jpg')",
        Thunderstorm: "url('./images/thunderstorm.jpg')",
        Snow: "url('./images/snow.jpg')",
        default: "url('./images/clear.jpg')"
    };

    // <---------- Functions ---------->

    //  Check The Input and The Validation
    function searchValue(e) {
        if (e.key === "Enter") {
            const query = searchBox.value.trim()
            if (query === '') {
                return
            }
            getMyData(query)
        }
    }

    // Fetch API
    async function getMyData(query) {
        try {
            // Validation From Name City
            const saveQuery = encodeURIComponent(query)

            const res = await fetch(`${apiKey.base}${saveQuery}${apiKey.default}`)
            if (!res.ok) throw new Error("Failed to fetch data")
            const myData = await res.json()
            setLocalStorage(myData)
        } catch (err) {
            console.error(err)
            showErrorMessage("Something went wrong. Please try again.")
        }
    }

    // Create Error Message 
    function showErrorMessage(message) {
        errorMessage.classList.remove("hidden")
        errorText.textContent = message
        setTimeout(() => {
            errorMessage.classList.add("hidden")
        }, 4000)
    }

    // Set Data in LocalStorage
    function setLocalStorage(data) {
        const weatherInfo = {
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            feelsLike: data.main.feels_like,
            description: data.weather[0].description,
            description_state: data.weather[0].main,
            date: data.dt,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            visibility: data.visibility / 1000,
        }
        window.localStorage.setItem("weather", JSON.stringify(weatherInfo))
        renderWeatherDisplay(weatherInfo)
    }

    // Get Data From LocalStorage
    function getLocalStorage() {
        const savedData = localStorage.getItem("weather")
        const lastCity = savedData ? JSON.parse(savedData).city : "cairo"
        getMyData(lastCity)
    }

    // Set All Data In App Display
    function renderWeatherDisplay(info) {
        locationEl.textContent = `${info.city}, ${info.country}`
        temp.textContent = `${info.temp}°`
        descriptionEl.textContent = info.description
        feelsLikeEl.textContent = `Feels Like ${info.feelsLike}`
        humidityEl.textContent = `${info.humidity} %`
        windSpeedEl.textContent = `${info.windSpeed} m/s`
        pressureEl.textContent = `${info.pressure} hPa`
        visibilityEl.textContent = `${info.visibility} Km`
        weatherDate(info.date)
        updateBackgroundImage(info.description_state)
    }

    // Change Background From Description Weather
    function updateBackgroundImage(state) {
        const body = document.body
        body.style.backgroundImage = backgrounds[state] || backgrounds.Clear
        body.classList.remove("opacity-0")
        body.classList.add("opacity-100")
    }

    // Set Date From Date Weather 
    function weatherDate(date) {
        const getDate = new Date(date * 1000).toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            year: "2-digit",
            day: "2-digit"
        })
        dateEl.textContent = getDate
    }

    // <--------- Event Listener --------->

    // Render The Weather From LocalStorage
    getLocalStorage()

    // Add Focus On Input Search
    searchBox.focus()

    // Add Event ON Input Search
    searchBox.addEventListener("keypress", searchValue)
}())