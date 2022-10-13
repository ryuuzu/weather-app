import { POLLUTION_URL, API_KEY, ICON_URL, DEGREE } from "../consts";
import windIcon from "../icons/Wind.svg";
import "./airquality.css";

const qualityFilters = {
	1: "invert(74%) sepia(72%) saturate(5604%) hue-rotate(86deg) brightness(120%) contrast(128%)",
	2: "invert(99%) sepia(90%) saturate(3328%) hue-rotate(0deg) brightness(102%) contrast(103%)",
	3: "invert(83%) sepia(28%) saturate(6747%) hue-rotate(359deg) brightness(101%) contrast(105%)",
	4: "invert(56%) sepia(41%) saturate(3895%) hue-rotate(359deg) brightness(100%) contrast(108%)",
	5: "invert(35%) sepia(50%) saturate(5802%) hue-rotate(2deg) brightness(104%) contrast(104%)",
};
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

function createAirQualityStuffs(airQualityData) {
	const airQualityContainer = document.querySelector(".air-quality-holder");

	for (const child of airQualityContainer.children) {
		airQualityContainer.removeChild(child);
	}

	const mainAQI = document.createElement("div");
	mainAQI.classList.add("aqi");
	mainAQI.style.setProperty(
		"--filter",
		qualityFilters[airQualityData.aqi.value]
	);

	const windImage = new Image();
	windImage.src = windIcon;
	windImage.classList.add("aqi-image");
	mainAQI.appendChild(windImage);

	const mainAQITexts = document.createElement("div");

	const aqiText = document.createElement("div");
	aqiText.textContent = airQualityData.aqi.text.text;
	aqiText.classList.add("aqi-text");
	mainAQITexts.appendChild(aqiText);

	const aqiDescription = document.createElement("div");
	aqiDescription.textContent = airQualityData.aqi.text.description;
	aqiDescription.classList.add("aqi-description");
	mainAQITexts.appendChild(aqiDescription);
	
	mainAQI.appendChild(mainAQITexts);

	const aqiComponentsHolder = document.createElement("div");
	aqiComponentsHolder.classList.add("aqi-components");

	airQualityData.components.forEach((component) => {
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

		aqiComponentsHolder.appendChild(aqiComponent);
		console.log(component);
	});

	airQualityContainer.appendChild(mainAQI);
	airQualityContainer.appendChild(aqiComponentsHolder);
}

export default async function updateAirQuality(lat, lon) {
	const response = await fetch(
		`${POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
	);
	const data = await response.json();

	const airQualityData = data.list[0];

	const filteredData = {
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

	createAirQualityStuffs(filteredData);
}
