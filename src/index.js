import './css/styles.css';
import CountryApiService from './js/fetchCountries';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
    inputCountryName: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

const countryApiService = new CountryApiService();

refs.inputCountryName.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    countryApiService.query = e.target.value.trim();
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    if (countryApiService.query === '') {
        return;
    }
    countryApiService.fetchCountries()
        .then(appendCountryInfo)
        .catch(err => {
            Notify.failure('Oops, there is no country with that name')
            console.log(err);
    });
}

function appendCountryInfo(countries) {
    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }

    refs.countryList.innerHTML = countries.map(({ name, flags: { svg } }) => {
        return `<li class="country-list__item">
                    <img src="${svg}" alt="${name}" width="60" height="40"/>
                    <span class="country-list__name">${name}</span>
                </li>`;
    }).join('');

    if (countries.length === 1) {
        refs.countryInfo.innerHTML = countries.map(({ capital, population, languages }) => {
            return `<ul class="country-info__list">
                        <li class="country-info__item">
                            <span class="country-info__label">Capital:</span>
                            <span class="country-info__value">${capital}</span>
                        </li>
                        <li class="country-info__item">
                            <span class="country-info__label">Population:</span>
                            <span class="country-info__value">${population}</span>
                        </li>
                        <li class="country-info__item">
                            <span class="country-info__label">Languages:</span>
                            <span class="country-info__value">${languages.map(({ name }) => name).join(', ')}</span>
                        </li>
                    </ul>`;
        }).join('');
    }
}