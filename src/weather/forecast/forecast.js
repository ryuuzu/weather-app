import { FORECAST_URL, API_KEY, ICON_URL, DEGREE } from "../consts";
import { format, isAfter, isSameDay, isToday } from "date-fns";
import "./forecast.css";

function filterForecastData(forecastData) {
	let filteredForecastData = [];

	for (let i = 0; i < forecastData.length; i++) {
		if (
			filteredForecastData.length !== 0 &&
			isSameDay(
				new Date(
					filteredForecastData[filteredForecastData.length - 1].dt_txt
				),
				new Date(forecastData[i].dt_txt)
			)
		) {
			continue;
		}
		if (
			isAfter(
				new Date(forecastData[i].dt_txt),
				new Date(`${forecastData[i].dt_txt.split(" ")[0]} 12:00:00`)
			)
		) {
			filteredForecastData.push(forecastData[i]);
		}
		if (
			filteredForecastData.length !== 0 &&
			!isSameDay(
				new Date(
					filteredForecastData[filteredForecastData.length - 1].dt_txt
				),
				new Date(forecastData[i].dt_txt)
			) &&
			i === forecastData.length - 1
		) {
			filteredForecastData.push(forecastData[i]);
		}
	}

	return filteredForecastData;
}

function createForecastChild(temp, date, icon) {
	const forecastInfoContainer = document.createElement("div");
	forecastInfoContainer.classList.add("forecast-item");

	if (isToday(date)) {
		forecastInfoContainer.classList.add("today");
	}

	const forecastIcon = document.createElement("img");
	forecastIcon.src = `${ICON_URL}${icon}@2x.png`;
	forecastIcon.classList.add("forecast-icon");

	forecastInfoContainer.appendChild(forecastIcon);

	const forecastDay = document.createElement("div");
	forecastDay.textContent = format(date, "eee");
	forecastDay.classList.add("forecast-day");

	forecastInfoContainer.appendChild(forecastDay);

	const forecastTemp = document.createElement("div");
	forecastTemp.textContent = temp;
	forecastTemp.classList.add("forecast-temp");

	forecastInfoContainer.appendChild(forecastTemp);

	return forecastInfoContainer;
}

export default async function updateForecast(city, units) {
	let forecastContainer = document.querySelector(".forecast");

	for (const child of forecastContainer.children) {
		forecastContainer.removeChild(child);
	}

	const response = await fetch(
		`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=${units}`
	);
	const data = await response.json();

	let filteredForecastData = filterForecastData(data.list);

	filteredForecastData.forEach((forecastData) => {
		const date = new Date(forecastData.dt_txt);
		const temp = `${Math.round(forecastData.main.temp)}${DEGREE}`;
		const icon = forecastData.weather[0].icon;
		forecastContainer.appendChild(createForecastChild(temp, date, icon));
	});
}
