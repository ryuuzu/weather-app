import { format } from "date-fns";
import updateForecast from "./weather/forecast/forecast";

import "./index.css";
import updateAirQuality from "./weather/airquality/airquality";

let units = "metric";
let city = "Kathmandu";

document.querySelector(".current-time").textContent = format(new Date(), "p");
document.querySelector(".current-date").textContent = format(
	new Date(),
	"eeee, d MMMM, yyyy"
);

updateForecast(city, units);
let latLonData;
updateAirQuality(27.7167, 85.3167);
