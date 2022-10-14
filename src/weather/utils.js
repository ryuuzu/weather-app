import { API_KEY, GEO_URL } from "./consts";

const domParser = new DOMParser();

export async function getGeoCode(locationName) {
	const response = await fetch(
		`${GEO_URL}?q=${locationName}&appid=${API_KEY}&limit=1`
	);
	return await response.json();
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
