import { format } from "date-fns";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { getWeatherData } from "../current/current";
import { getMaterialSymbolRounded, getPolyfillTimezone } from "../utils";
import "./sunstats.css";

function getSunStatsHTML(citiesWeatherData) {
	return citiesWeatherData.map((cityWeatherData) => {
		const sunStatHolder = document.createElement("div");
		sunStatHolder.classList.add("sun-stat");

		const sunStatTopBar = document.createElement("div");
		sunStatTopBar.classList.add("sun-stat-topbar");

		const locationHolder = document.createElement("div");
		locationHolder.classList.add("location-holder");

		const locationImage = getMaterialSymbolRounded("location_on", [
			"location-icon",
		]);
		locationHolder.appendChild(locationImage);

		const locationName = document.createElement("div");
		locationName.classList.add("location-name");
		locationName.textContent = cityWeatherData.name;
		locationHolder.appendChild(locationName);

		sunStatTopBar.appendChild(locationHolder);

		const moreSettings = getMaterialSymbolRounded("more_vert", [
			"settings",
		]);
		sunStatTopBar.appendChild(moreSettings);

		const sunriseHolder = document.createElement("div");
		sunriseHolder.classList.add("sunrise");

		const sunriseIcon = getMaterialSymbolRounded("wb_sunny", [
			"sunrise-icon",
		]);
		sunriseHolder.appendChild(sunriseIcon);

		const sunriseTexts = document.createElement("div");
		sunriseTexts.classList.add("sunrise-texts");
		sunriseHolder.appendChild(sunriseTexts);

		const sunriseLabel = document.createElement("div");
		sunriseLabel.classList.add("sunrise-label");
		sunriseLabel.textContent = "Sunrise";
		sunriseTexts.appendChild(sunriseLabel);

		const sunriseTimeZonedObject = utcToZonedTime(
			new Date(cityWeatherData.sunrise * 1000).toISOString(),
			getPolyfillTimezone(cityWeatherData.timezone)
		);

		const sunriseTime = document.createElement("div");
		sunriseTime.classList.add("sunrise-time");
		sunriseTime.textContent = format(sunriseTimeZonedObject, "p");
		sunriseTexts.appendChild(sunriseTime);

		const sunsetHolder = document.createElement("div");
		sunsetHolder.classList.add("sunset");

		const sunsetIcon = getMaterialSymbolRounded("wb_twilight", [
			"sunset-icon",
		]);
		sunsetHolder.appendChild(sunsetIcon);

		const sunsetTexts = document.createElement("div");
		sunsetTexts.classList.add("sunset-texts");
		sunsetHolder.appendChild(sunsetTexts);

		const sunsetLabel = document.createElement("div");
		sunsetLabel.classList.add("sunset-label");
		sunsetLabel.textContent = "Sunset";
		sunsetTexts.appendChild(sunsetLabel);

		const sunsetTimeZonedObject = utcToZonedTime(
			new Date(cityWeatherData.sunset * 1000).toISOString(),
			getPolyfillTimezone(cityWeatherData.timezone)
		);

		const sunsetTime = document.createElement("div");
		sunsetTime.classList.add("sunset-time");
		sunsetTime.textContent = format(sunsetTimeZonedObject, "p");
		sunsetTexts.appendChild(sunsetTime);

		sunStatHolder.appendChild(sunStatTopBar);
		sunStatHolder.appendChild(sunriseHolder);
		sunStatHolder.appendChild(sunsetHolder);
		return sunStatHolder;
	});
}

export default async function updateSunStats(cities, unit) {
	const sunStatsHolder = document.querySelector(".sun-stats-holder");

	Array.from(sunStatsHolder.childNodes).forEach((childNode) => {
		sunStatsHolder.removeChild(childNode);
	});

	let citiesWeatherData = await Promise.all(
		cities.map(async (city) => {
			return await getWeatherData(city, unit);
		})
	);

	getSunStatsHTML(citiesWeatherData).forEach((sunStatHTML) => {
		sunStatsHolder.appendChild(sunStatHTML);
	});
}
