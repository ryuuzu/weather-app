import { API_KEY, GEO_URL } from "./consts";

export default async function getGeoCode(locationName) {
	const response = await fetch(
		`${GEO_URL}?q=${locationName}&appid=${API_KEY}&limit=5`
	);
    return await response.json()
}

export default async function getLatLonFor(location) {
    const geoData = await getGeoCode(location)
    return {lat: geoData.lat, lon: geoData.lon}
}
