import { createAppContainer, createLoadingIndicator, createWeatherDisplay, createCityList, createRefreshButton, createAddCityButton, createElement as uiCreateElement } from './ui.js';
import { getCurrentLocation } from './geolocation.js';
import { getWeatherByCoords, getWeatherByCityName } from './api.js';
import { saveState, loadState } from './storage.js';

let currentCityWeather = null;
let cityListData = [];

document.addEventListener('DOMContentLoaded', async () => {
    const appContainer = createAppContainer();
    const loader = createLoadingIndicator();
    appContainer.appendChild(loader);
    document.getElementById('app').appendChild(appContainer);

    const savedState = loadState();
    if (savedState && savedState.cities && savedState.cities.length > 0) {
         cityListData = savedState.cities;
         currentCityWeather = cityListData[0];
         appContainer.removeChild(loader);
         renderApp(appContainer);
         return;
    }

    try {
        const location = await getCurrentLocation();
        const weatherResult = await getWeatherByCoords(location.latitude, location.longitude);

        const currentLocationDisplay = `Текущая локация - ${weatherResult.name}`;
        currentCityWeather = { ...weatherResult, name: currentLocationDisplay, originalName: weatherResult.name, isCurrentLocation: true };
        cityListData.push(currentCityWeather);

        saveState({ cities: cityListData });

        appContainer.removeChild(loader);
        renderApp(appContainer);

    } catch (error) {
        if (appContainer.contains(loader)) {
            appContainer.removeChild(loader);
        }

        const errorElement = uiCreateElement('div', 'error-message', `Ошибка геолокации: ${error.message || 'Не удалось получить местоположение.'}`);
        appContainer.appendChild(errorElement);

        showCityInputForm(appContainer, errorElement);
    }
});

function renderApp(container) {
    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }

    if (currentCityWeather) {
        const weatherDisplay = createWeatherDisplay(currentCityWeather);
        container.appendChild(weatherDisplay);
    }

    const cityList = createCityList(cityListData, (selectedCity) => {
        currentCityWeather = selectedCity;
        renderApp(container);
    }, currentCityWeather ? currentCityWeather.name : null);
    container.appendChild(cityList);

    const refreshBtn = createRefreshButton(refreshWeather);
    container.appendChild(refreshBtn);

    const addCityBtn = createAddCityButton(() => console.log('adding new city'));
    container.appendChild(addCityBtn);
}

async function refreshWeather() {
    if (!currentCityWeather) return;

    const container = document.querySelector('.app-container');
    const loader = createLoadingIndicator();
    container.appendChild(loader);

    try {
        let updatedResult;
        if (currentCityWeather.isCurrentLocation) {
             updatedResult = await getWeatherByCityName(currentCityWeather.originalName);
             updatedResult = { ...updatedResult, name: `Текущая локация - ${updatedResult.name}`, originalName: updatedResult.name, isCurrentLocation: true };
        } else {
             updatedResult = await getWeatherByCityName(currentCityWeather.name);
        }

        currentCityWeather.forecasts = updatedResult.forecasts;
        if (currentCityWeather.isCurrentLocation) {
            currentCityWeather.name = updatedResult.name;
        }

        const index = cityListData.findIndex(c => (c.isCurrentLocation && currentCityWeather.isCurrentLocation && c.originalName === currentCityWeather.originalName) || (!c.isCurrentLocation && !currentCityWeather.isCurrentLocation && c.name === currentCityWeather.name));
        if (index !== -1) {
            cityListData[index] = currentCityWeather;
        }
        saveState({ cities: cityListData });
        renderApp(container);
    } catch (error) {
        const errorDisplay = uiCreateElement('div', 'error-message', `Ошибка обновления: ${error.message}`);
        container.appendChild(errorDisplay);
    } finally {
        if (container.contains(loader)) {
            container.removeChild(loader);
        }
    }
}