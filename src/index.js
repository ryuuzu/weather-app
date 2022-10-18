import "./index.css";
import { format } from "date-fns";
import updateForecast from "./weather/forecast/forecast";
import updateAirQuality from "./weather/airquality/airquality";
import { getGeoCode, getLatLonFor } from "./weather/utils";
import { updateWeather } from "./weather/current/current";
import updateSunStats from "./weather/sunstats/sunstats";

const DEFAULT_UNIT = "metric";
const DEFAULT_CITIES = [
	{ name: "Bucharest", lat: 44.4361414, lon: 26.1027202, country: "RO" },
	{
		name: "Tokyo",
		lat: 35.6828387,
		lon: 139.7594549,
		country: "JP",
	},
];

let units = "";
let cities = [];
let geoCodes = [];

function saveLocalData() {
	localStorage.setItem("cities", JSON.stringify(cities));
	localStorage.setItem("units", units);
}

function loadLocalData() {
	cities = JSON.parse(localStorage.getItem("cities"));
	if (cities === null) {
		cities = DEFAULT_CITIES;
	}
	units = localStorage.getItem("units");
	if (units === null) {
		units = DEFAULT_UNIT;
	}
	saveLocalData();
}

function refreshPage() {
	document.querySelector(".current-time").textContent = format(
		new Date(),
		"p"
	);
	document.querySelector(".current-date").textContent = format(
		new Date(),
		"eeee, d MMMM, yyyy"
	);

	let lat = cities[0].lat;
	let lon = cities[0].lon;
	setTimeout(addEventListeners, 1000);
	updateForecast(lat, lon, units);
	updateAirQuality(lat, lon);
	updateWeather(cities, units);
	updateSunStats(cities, units);
}

const searchBar = document.querySelector("#search");
searchBar.addEventListener("keydown", async (event) => {
	const dataList = document.querySelector("#suggestions");

	if (event.code === "Enter") {
		if (dataList.options.length !== 0) {
			const optionElement =
				dataList.options[event.target.value.split(":")[0]];
			cities.push({
				name: optionElement.getAttribute("name"),
				lat: parseFloat(optionElement.getAttribute("lat")),
				lon: parseFloat(optionElement.getAttribute("lon")),
				country: optionElement.getAttribute("country"),
			});
			Array.from(dataList.childNodes).forEach((childNode) =>
				dataList.removeChild(childNode)
			);
			event.target.value = "";
			refreshPage();
		} else {
			const searchKey = event.target.value;
			geoCodes = await getGeoCode(searchKey);
			if (geoCodes.length === 0) {
				console.log("Error");
			} else if (geoCodes.length === 1) {
				cities.push({
					name: geoCodes[0].name,
					lat: geoCodes[0].lat,
					lon: geoCodes[0].lon,
					country: geoCodes[0].country,
				});
				refreshPage();
			} else {
				event.target.value = "";
				geoCodes.forEach((geoCode, index) => {
					const optionElement = document.createElement("option");
					optionElement.label = `${geoCode.name}, ${geoCode.country}`;
					optionElement.value = `gc_${index}: ${geoCode.name}`;
					optionElement.setAttribute("id", `gc_${index}`);
					optionElement.setAttribute("name", geoCode.name);
					optionElement.setAttribute("lat", geoCode.lat);
					optionElement.setAttribute("lon", geoCode.lon);
					optionElement.setAttribute("country", geoCode.country);

					dataList.appendChild(optionElement);
				});
			}
		}
		saveLocalData();
	}
});

loadLocalData();
refreshPage();

function addEventListeners() {
	const sunStatsSettings = document.querySelectorAll(".sun-stat .settings");
	sunStatsSettings.forEach((sunStatSetting) => {
		sunStatSetting.addEventListener("click", (event) => {
			const settingsMenu = document.createElement("div");
			settingsMenu.classList.add("settings-menu");
			settingsMenu.style.setProperty(
				"--x-location",
				`${event.screenX}px`
			);
			settingsMenu.style.setProperty(
				"--y-location",
				`${event.screenY}px`
			);

			const removeCitySettings = document.createElement("div");
			removeCitySettings.classList.add("remove-settings");
			removeCitySettings.textContent = "Remove City";

			removeCitySettings.addEventListener("click", (event) => {
				const sunStatHolder = event.target.parentElement.parentElement;
				const lat = parseFloat(sunStatHolder.getAttribute("lat"));
				const lon = parseFloat(sunStatHolder.getAttribute("lon"));
				cities = cities.filter(
					(city) => city.lat !== lat && city.lon !== lon
				);
				refreshPage();
				saveLocalData();
			});

			settingsMenu.appendChild(removeCitySettings);

			event.target.parentElement.parentElement.appendChild(settingsMenu);
		});
	});
}
