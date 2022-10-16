import "./index.css";
import { format } from "date-fns";
import updateForecast from "./weather/forecast/forecast";
import updateAirQuality from "./weather/airquality/airquality";
import { getLatLonFor } from "./weather/utils";
import { updateWeather } from "./weather/current/current";
import updateSunStats from "./weather/sunstats/sunstats";

const DEFAULT_UNIT = "metric";
const DEFAULT_CITIES = ["Bucharest", "Kathmandu", "Tokyo"];

let units, cities;

function saveLocalData() {
	localStorage.setItem("cities", cities);
	localStorage.setItem("units", units);
}

function loadLocalData() {
	cities = localStorage.getItem("cities");
	if (cities === null) {
		cities = DEFAULT_CITIES;
	}
	units = localStorage.getItem("units");
	if (units === null) {
		units = DEFAULT_UNIT;
	}
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

	updateForecast(cities[0], units);
	getLatLonFor(cities[0]).then((latLonData) => {
		updateAirQuality(latLonData.lat, latLonData.lon);
	});
	updateWeather(cities, units);
	updateSunStats(cities, units);
}

const searchBar = document.querySelector("#search");
searchBar.addEventListener("keydown", (event) => {
	console.log(event.code);
});

loadLocalData();
refreshPage();
