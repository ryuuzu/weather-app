import { CURRENT_URL, API_KEY, ICON_URL, DEGREE } from "../consts";
import "./current.css";
import { format } from "date-fns";
import { getMaterialSymbolRounded } from "../utils";

async function getWeatherData(city, unit) {
	const response = await fetch(
		`${CURRENT_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
	);
	const data = await response.json();

	let filteredData = {
		name: data.name,
		icon: data.weather[0].icon,
		weather: {
			id: data.weather[0].id,
			name: data.weather[0].main,
			description: data.weather[0].description,
		},
		temp: data.main.temp,
		humidity: data.main.humidity,
		wind: data.wind.speed,
		sunrise: data.sys.sunrise,
		sunset: data.sys.sunset,
	};

	return filteredData;
}

function addCurrentWeatherHTML(weatherData, container) {
	const locationHolder = document.createElement("div");
	locationHolder.classList.add("location-holder");

	const locationImage = getMaterialSymbolRounded("location_on", [
		"location-icon",
	]);
	locationHolder.appendChild(locationImage);

	const locationName = document.createElement("div");
	locationName.classList.add("location-name");
	locationName.textContent = weatherData.name;
	locationHolder.appendChild(locationName);

	const weatherIcon = document.createElement("img");
	weatherIcon.src = `${ICON_URL}${weatherData.icon}@2x.png`;
	weatherIcon.classList.add("weather-icon");

	const todayDate = document.createElement("div");
	todayDate.classList.add("today-date");
	todayDate.textContent = `Today${format(new Date(), ", d MMMM")}`;

	const tempDisplay = document.createElement("div");
	tempDisplay.classList.add("temp");
	tempDisplay.textContent = `${Math.round(weatherData.temp)}${DEGREE}`;

	const weatherStatus = document.createElement("div");
	weatherStatus.classList.add("weather-status");
	weatherStatus.textContent = weatherData.weather.name;

	const windHolder = document.createElement("div");
	windHolder.classList.add("wind-data");

	const windLabel = document.createElement("div");
	windLabel.appendChild(getMaterialSymbolRounded("air", ["wind-icon"]));
	windLabel.innerHTML += "Wind";
	windLabel.classList.add("wind-label");
	windHolder.appendChild(windLabel);

	const windValue = document.createElement("div");
	windValue.classList.add("wind-value");
	windValue.textContent = `${Math.round(weatherData.wind * 3.6)} km/hr`;
	windHolder.appendChild(windValue);

	const humidityHolder = document.createElement("div");
	humidityHolder.classList.add("humidity-data");

	const humidityLabel = document.createElement("div");
	humidityLabel.appendChild(
		getMaterialSymbolRounded("water_drop", ["humidity-icon"])
	);
	humidityLabel.innerHTML += "Humidity";
	humidityLabel.classList.add("humidity-label");
	humidityHolder.appendChild(humidityLabel);

	const humidityValue = document.createElement("div");
	humidityValue.classList.add("humidity-value");
	humidityValue.textContent = `${weatherData.humidity}%`;
	humidityHolder.appendChild(humidityValue);

	const elements = [
		locationHolder,
		weatherIcon,
		todayDate,
		tempDisplay,
		weatherStatus,
		windHolder,
		humidityHolder,
	];

	elements.forEach((element) => container.appendChild(element));
}

export default async function updateWeather(cities, unit) {
	let currentCity = cities[0];
	let otherCities = cities.slice(1);

	let currentCityContainer = document.querySelector(".current-location");

	const currentCityData = await getWeatherData(currentCity, unit);
	addCurrentWeatherHTML(currentCityData, currentCityContainer);
}
