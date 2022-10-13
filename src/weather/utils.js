import { API_KEY, GEO_URL } from "./consts";

export async function getGeoCode(locationName) {
	const response = await fetch(
		`${GEO_URL}?q=${locationName}&appid=${API_KEY}&limit=1`
	);
	return await response.json();
}

export async function getLatLonFor(location) {
	const geoData = (await getGeoCode(location))[0];
	return { lat: geoData.lat, lon: geoData.lon };
}
