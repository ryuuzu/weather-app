import { API_KEY, GEO_URL } from "./consts";

const domParser = new DOMParser();

export async function getGeoCode(locationName) {
	const response = await fetch(
		`${GEO_URL}?q=${locationName}&appid=${API_KEY}&limit=1`
	);
	return await response.json();
}

export function getPolyfillTimezone(seconds) {
	let pfTimezone = "";
	if (seconds > 0) {
		pfTimezone += "+";
	} else if (seconds < 0) {
		pfTimezone += "-";
		seconds *= -1;
	} else {
		return "+00:00";
	}
	let hours = Math.floor(seconds / 3600).toString();
	let minutes = ((seconds % 3600) / 60).toString();
	if (hours.length === 1) {
		hours = "0" + hours;
	}
	if (minutes.length === 1) {
		minutes = "0" + minutes;
	}
	pfTimezone += hours;
	pfTimezone += minutes;
	return pfTimezone;
}

export function generateRandomNumber(maxVal) {
	return Math.floor(Math.random() * maxVal);
}

export function generateRandomColor() {
	return `rgb(${generateRandomNumber(256)}, ${generateRandomNumber(
		256
	)}, ${generateRandomNumber(256)})`;
}

export function getMaterialSymbolRounded(iconName, additionalClassLists = []) {
	const iconHTML = domParser
		.parseFromString(
			`<span class="material-symbols-rounded">
			${iconName}
			</span>`,
			"text/html"
		)
		.querySelector(".material-symbols-rounded");
	if (additionalClassLists.length > 0) {
		iconHTML.classList.add(...additionalClassLists);
	}
	return iconHTML;
}

export async function getLatLonFor(location) {
	const geoData = (await getGeoCode(location))[0];
	return { lat: geoData.lat, lon: geoData.lon };
}
