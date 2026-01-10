import { createElement, createCityInputForm, createAutocompleteList, showError, hideError } from './ui.js';

export function createAddCityModal(onSubmit, onCancel) {
    const overlay = createElement('div', 'modal-overlay');
    const modalContainer = createElement('div', 'modal-container');
    const modal = createElement('div', 'modal');
    const modalHeader = createElement('div', 'modal-header');
    const modalTitle = createElement('h3', 'modal-title', 'Добавить город');
    const modalCloseBtn = createElement('span', 'modal-close-btn', '×');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalCloseBtn);
    modal.appendChild(modalHeader);

    let autocompleteList = null;

    const updateAutocomplete = async (query, inputElement) => {
        if (autocompleteList && modal.contains(autocompleteList)) {
            inputContainer.removeChild(autocompleteList);
        }

        if (query.length < 2) return;

        try {
            const mockCities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Пермь', 'Воронеж', 'Волгоград'];
            const matches = mockCities.filter(city => city.toLowerCase().startsWith(query.toLowerCase()));

            if (matches.length > 0) {
                autocompleteList = createAutocompleteList(matches, (selectedCity) => {
                    inputElement.value = selectedCity;
                    if (autocompleteList && modal.contains(autocompleteList)) {
                        inputContainer.removeChild(autocompleteList);
                    }
                    if (errorDiv) hideError(errorDiv);
                });
                if (inputContainer) {
                    inputContainer.appendChild(autocompleteList);
                }
            }
        } catch (err) {
            console.error("Autocomplete error:", err);
        }
    };

    const { form, errorDiv, inputContainer } = createCityInputForm(
        async (cityName, errorDisplay) => {
            try {
                await onSubmit(cityName, errorDisplay);
                closeModal();
            } catch (err) {
                console.error("Error in modal submit:", err);
            }
        },
        () => {
             onCancel();
             closeModal();
        },
        (e) => {
            hideError(errorDiv);
            updateAutocomplete(e.target.value, e.target);
        }
    );

    modal.appendChild(form);

    const closeModal = () => {
        if (overlay && document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        if (autocompleteList && modal.contains(autocompleteList)) {
            modal.removeChild(autocompleteList);
        }
    };

    modalCloseBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    modalContainer.appendChild(modal);
    overlay.appendChild(modalContainer);

    return overlay;
}

export function showAddCityModal(onSubmit, onCancel) {
    const modalOverlay = createAddCityModal(onSubmit, onCancel);
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';

    return () => {
         document.body.removeChild(modalOverlay);
         document.body.style.overflow = '';
    };
}