export function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

export function createAppContainer() {
    const container = createElement('div', 'app-container');
    const header = createElement('h1', 'app-title', 'Прогноз погоды');
    container.appendChild(header);
    return container;
}

export function createLoadingIndicator() {
    const loader = createElement('div', 'loading', 'Загрузка...');
    return loader;
}

export function createWeatherDisplay(weatherData) {
    const display = createElement('div', 'weather-display');
    const title = createElement('h2', 'city-name', weatherData.name);
    display.appendChild(title);

    weatherData.forecasts.forEach(forecast => {
        const forecastItem = createElement('div', 'forecast-item');
        const date = createElement('p', 'forecast-date', new Date(forecast.date).toLocaleDateString('ru-RU'));
        const temp = createElement('p', 'forecast-temp', `${Math.round(forecast.temp_min)}°C / ${Math.round(forecast.temp_max)}°C`);
        const desc = createElement('p', 'forecast-desc', forecast.description);
        const icon = createElement('img', 'forecast-icon');
        icon.src = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
        icon.alt = forecast.description;

        forecastItem.appendChild(date);
        forecastItem.appendChild(temp);
        forecastItem.appendChild(desc);
        forecastItem.appendChild(icon);
        display.appendChild(forecastItem);
    });

    return display;
}

export function createCityList(cities, onCitySelect, onDeleteCity, activeCityName) {
    const list = createElement('div', 'city-list');
    cities.forEach(city => {
        const cityItem = createElement('div', 'city-item');
        cityItem.textContent = city.name;
        if (activeCityName && city.name === activeCityName) {
            cityItem.classList.add('active');
        }
        cityItem.addEventListener('click', () => onCitySelect && onCitySelect(city));
        list.appendChild(cityItem);

        if (onDeleteCity) {
             const deleteBtn = createElement('button', 'delete-city-btn', '×');
             deleteBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 onDeleteCity(city);
             });
             cityItem.appendChild(deleteBtn);
        }
    });
    return list;
}

export function createRefreshButton(onClick) {
    const button = createElement('button', 'refresh-btn', 'Обновить');
    button.addEventListener('click', onClick);
    return button;
}

export function createAddCityButton(onClick) {
    const button = createElement('button', 'add-city-btn', 'Добавить город');
    button.addEventListener('click', onClick);
    return button;
}

export function createCityInputForm(onSubmit, onCancel, onInput, autocompleteListElement = null) {
    const form = createElement('form', 'city-input-form');
    const inputContainer = createElement('div', 'input-container');
    const input = createElement('input', 'city-input');
    input.type = 'text';
    input.placeholder = 'Введите название города...';
    input.addEventListener('input', onInput);

    const errorDiv = createElement('div', 'error-message');

    const submitBtn = createElement('button', 'submit-btn', 'Добавить');
    submitBtn.type = 'submit';
    const cancelBtn = createElement('button', 'cancel-btn', 'Отмена');
    cancelBtn.type = 'button';

    inputContainer.appendChild(input);
    if (autocompleteListElement) {
        inputContainer.appendChild(autocompleteListElement);
    }

    form.appendChild(inputContainer);
    form.appendChild(errorDiv);
    form.appendChild(submitBtn);
    form.appendChild(cancelBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmit(input.value.trim(), errorDiv);
    });

    cancelBtn.addEventListener('click', onCancel);

    return { form, input, errorDiv, inputContainer };
}

export function createAutocompleteList(items, onSelect) {
    const list = createElement('ul', 'autocomplete-list');
    items.forEach(item => {
        const li = createElement('li', 'autocomplete-item', item);
        li.addEventListener('click', () => onSelect(item));
        list.appendChild(li);
    });
    return list;
}

export function createFooter() {
    const footer = createElement('footer', 'app-footer');
    const footerText1 = createElement('p', 'footer-text', 'Semyon Shevchenko');
    const footerText2 = createElement('p', 'footer-text', 'tg:@boredot');
    const footerText3 = createElement('p', 'footer-text', '409886@niuitmo.ru');
    footer.appendChild(footerText1);
    footer.appendChild(footerText2);
    footer.appendChild(footerText3);
    return footer;
}

export function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

export function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}