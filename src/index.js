import "./index.css";
import { format } from "date-fns";
import updateForecast from "./weather/forecast/forecast";
import updateAirQuality from "./weather/airquality/airquality";
import { getLatLonFor } from "./weather/utils";

let units = "metric";
let city = "Kathmandu";

document.querySelector(".current-time").textContent = format(new Date(), "p");
document.querySelector(".current-date").textContent = format(
	new Date(),
	"eeee, d MMMM, yyyy"
);

updateForecast(city, units);
getLatLonFor(city).then((latLonData) => {
	updateAirQuality(latLonData.lat, latLonData.lon);
});
