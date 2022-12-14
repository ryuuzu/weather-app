import { POLLUTION_URL, API_KEY } from "../consts";
import { getMaterialSymbolRounded } from "../utils";
import "./airquality.css";

const aqiText = [
	{ text: "Good", description: "Today's air is YUM YUM!" },
	{ text: "Fair", description: "I think this is fair enough." },
	{
		text: "Moderate",
		description: "Hm, I'm kinda suffocating but kinda breathing fine.",
	},
	{ text: "Poor", description: "I am the air's condition right now." },
	{
		text: "Very Poor",
		description: "Looks like its time to get a Oxygen Tank",
	},
];

const componentSafetyColors = [
	"#79bc6a",
	"#bbcf4c",
	"#eec20b",
	"#f29305",
	"#e8416f",
];

const componentSafetyLevels = {
	no2: [50, 100, 200, 400],
	pm10: [25, 50, 90, 180],
	o3: [60, 120, 180, 240],
	pm2_5: [15, 30, 55, 110],
};

function getSafetyLevel(amount, componentID) {
	let level = -1;
	if (
		!Object.getOwnPropertyNames(componentSafetyLevels).includes(componentID)
	) {
		return level;
	}
	let levels = componentSafetyLevels[componentID];

	for (let i = 0; i < levels.length; i++) {
		if (amount < levels[i]) {
			level = i;
			break;
		}
	}
	if (level === -1) {
		level = 4;
	}
	return level;
}

function getComponentsHTML(components) {
	return components.map((component) => {
		let colorLevel;
		const aqiComponent = document.createElement("div");
		aqiComponent.classList.add("aqi-component");
		if (component.level < 0) {
			colorLevel = "rgb(131, 171, 255)";
		} else {
			colorLevel = componentSafetyColors[component.level];
		}
		aqiComponent.style.setProperty("--colorLevel", colorLevel);

		const aqiComponentValue = document.createElement("div");
		aqiComponentValue.textContent = component.value;
		aqiComponentValue.classList.add("aqi-component-value");
		aqiComponent.appendChild(aqiComponentValue);

		const aqiComponentName = document.createElement("div");
		aqiComponentName.innerHTML = component.name;
		aqiComponentName.classList.add("aqi-component-name");
		aqiComponent.appendChild(aqiComponentName);

		const aqiComponentUnit = document.createElement("div");
		aqiComponentUnit.innerHTML = ` (${component.unit})`;
		aqiComponentUnit.classList.add("aqi-component-unit");
		aqiComponent.appendChild(aqiComponentUnit);

		return aqiComponent;
	});
}

function createAirQualityStuffs(airQualityData) {
	const airQualityContainer = document.querySelector(".air-quality-holder");

	Array.from(airQualityContainer.childNodes).forEach((childNode) =>
		airQualityContainer.removeChild(childNode)
	);

	const aqiTopBar = document.createElement("div");
	aqiTopBar.classList.add("aqi-topbar");

	const mainAQI = document.createElement("div");
	mainAQI.style.setProperty(
		"--color",
		componentSafetyColors[airQualityData.aqi.value - 1]
	);
	mainAQI.classList.add("aqi");

	mainAQI.appendChild(getMaterialSymbolRounded("air", ["aqi-image"]));

	const mainAQITexts = document.createElement("div");
	mainAQITexts.classList.add("aqi-texts");

	const aqiText = document.createElement("div");
	aqiText.innerHTML += airQualityData.aqi.text.text;
	aqiText.classList.add("aqi-text");
	mainAQITexts.appendChild(aqiText);

	const aqiDescription = document.createElement("div");
	aqiDescription.textContent = airQualityData.aqi.text.description;
	aqiDescription.classList.add("aqi-description");
	mainAQITexts.appendChild(aqiDescription);

	mainAQI.appendChild(mainAQITexts);

	const refreshButton = document.createElement("button");
	refreshButton.classList.add("button", "refresh");
	refreshButton.textContent = "Refresh";

	aqiTopBar.appendChild(mainAQI);
	aqiTopBar.appendChild(refreshButton);

	const aqiComponentsHolder = document.createElement("div");
	aqiComponentsHolder.classList.add("aqi-components");

	getComponentsHTML(airQualityData.components).forEach((componentHTML) =>
		aqiComponentsHolder.appendChild(componentHTML)
	);

	refreshButton.addEventListener("click", async (event) => {
		airQualityData = await getAirQualty(
			airQualityData.location.lat,
			airQualityData.location.lon
		);
		Array.from(aqiComponentsHolder.childNodes).forEach((childNode) =>
			aqiComponentsHolder.removeChild(childNode)
		);
		getComponentsHTML(airQualityData.components).forEach((componentHTML) =>
			aqiComponentsHolder.appendChild(componentHTML)
		);
	});

	airQualityContainer.appendChild(aqiTopBar);
	airQualityContainer.appendChild(aqiComponentsHolder);
}

async function getAirQualty(lat, lon) {
	const response = await fetch(
		`${POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
	);
	const data = await response.json();

	const airQualityData = data.list[0];

	const filteredData = {
		location: data.coord,
		aqi: {
			value: airQualityData.main.aqi,
			text: aqiText[airQualityData.main.aqi - 1],
		},
		components: [
			{
				name: `CO`,
				value:
					airQualityData.components.co > 500
						? (airQualityData.components.co / 1000).toFixed(2)
						: airQualityData.components.co,
				unit:
					airQualityData.components.co > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.co, "co"),
			},
			{
				name: `NO`,
				value:
					airQualityData.components.no > 500
						? (airQualityData.components.no / 1000).toFixed(2)
						: airQualityData.components.no,
				unit:
					airQualityData.components.no > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.no, "no"),
			},
			{
				name: `NO<sub>2</sub>`,
				value:
					airQualityData.components.no2 > 500
						? (airQualityData.components.no2 / 1000).toFixed(2)
						: airQualityData.components.no2,
				unit:
					airQualityData.components.no2 > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.no2, "no2"),
			},
			{
				name: `O<sub>3</sub>`,
				value:
					airQualityData.components.o3 > 500
						? (airQualityData.components.o3 / 1000).toFixed(2)
						: airQualityData.components.o3,
				unit:
					airQualityData.components.o3 > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.o3, "o3"),
			},
			{
				name: `SO<sub>2</sub>`,
				value:
					airQualityData.components.so2 > 500
						? (airQualityData.components.so2 / 1000).toFixed(2)
						: airQualityData.components.so2,
				unit:
					airQualityData.components.so2 > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.so2, "so2"),
			},
			{
				name: `PM<sub>2.5</sub>`,
				value:
					airQualityData.components.pm2_5 > 500
						? (airQualityData.components.pm2_5 / 1000).toFixed(2)
						: airQualityData.components.pm2_5,
				unit:
					airQualityData.components.pm2_5 > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.pm2_5, "pm2_5"),
			},
			{
				name: `PM<sub>10</sub>`,
				value:
					airQualityData.components.pm10 > 500
						? (airQualityData.components.pm10 / 1000).toFixed(2)
						: airQualityData.components.pm10,
				unit:
					airQualityData.components.pm10 > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.pm10, "pm10"),
			},
			{
				name: `NH<sub>3</sub>`,
				value:
					airQualityData.components.nh3 > 500
						? (airQualityData.components.nh3 / 1000).toFixed(2)
						: airQualityData.components.nh3,
				unit:
					airQualityData.components.nh3 > 500
						? `mg/m<sup>3</sup>`
						: `&micro;g/m<sup>3</sup>`,
				level: getSafetyLevel(airQualityData.components.nh3, "nh3"),
			},
		],
	};
	return filteredData;
}

export default async function updateAirQuality(lat, lon) {
	const filteredData = await getAirQualty(lat, lon);
	createAirQualityStuffs(filteredData);
}
