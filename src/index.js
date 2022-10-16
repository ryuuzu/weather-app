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
	updateForecast(lat, lon, units);
	updateAirQuality(lat, lon);
	updateWeather(cities, units);
	updateSunStats(cities, units);
}

const searchBar = document.querySelector("#search");
searchBar.addEventListener("keydown", async (event) => {
	if (event.code === "Enter") {
		const searchKey = event.target.value;
		const geoCode = await getGeoCode(searchKey);
		if (geoCode.length === 0) {
			console.log("Error");
		} else if (geoCode.length === 1) {
			cities.push(geoCode[0].name);
			refreshPage();
		}
		saveLocalData();
	}
});

loadLocalData();
refreshPage();
