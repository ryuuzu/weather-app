import "./index.css";
import searchIcon from "./icons/search_icon.png";
import { format } from "date-fns";
import updateForecast from "./weather/forecast/forecast";
import updateAirQuality from "./weather/airquality/airquality";
import { getLatLonFor } from "./weather/utils";
import { updateWeather } from "./weather/current/current";
import updateSunStats from "./weather/sunstats/sunstats";

let units = "metric";
let city = "Kathmandu";
let cities = ["Bucharest", "Kathmandu", "Tokyo"];

document.querySelector(".current-time").textContent = format(new Date(), "p");
document.querySelector(".current-date").textContent = format(
	new Date(),
	"eeee, d MMMM, yyyy"
);
document.documentElement.style.setProperty(
	"--search-icon",
	`url('${searchIcon}')`
);

updateForecast(city, units);
getLatLonFor(city).then((latLonData) => {
	updateAirQuality(latLonData.lat, latLonData.lon);
});
updateWeather(cities, units);
updateSunStats(cities, units);
