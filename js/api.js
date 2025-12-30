const API_KEY = '319b95eea652cec8cc5a102b133d22ed';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherByCoords(lat, lon) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const forecasts = processWeatherData(data);
    const cityName = data.city?.name || 'Unknown Location';
    return { name: cityName, forecasts };
}

export async function getWeatherByCityName(cityName) {
    const url = `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Город не найден');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const forecasts = processWeatherData(data);
    const resolvedName = data.city?.name || cityName;
    return { name: resolvedName, forecasts };
}

function processWeatherData(data) {
    const forecasts = {};
    const today = new Date().toISOString().split('T')[0];
    let daysAdded = 0;

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!forecasts[date] && (date === today || daysAdded <= 2)) {
            forecasts[date] = {
                date: date,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
            if (date !== today) daysAdded++;
        }
    });

    return Object.values(forecasts);
}