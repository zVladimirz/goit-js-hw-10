import Notiflix from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 3000;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function onFilter(event) {
  let inputText = inputEl.value.trim();
  if (inputText != '') {
    fetchCountries(inputText)
      .then(data => {
        const arLength = data.length;
        if (arLength === 1) {
          const capitalHTML = data[0].capital.reduce((list, listEl) => {
            if (list === '') {
              return list + listEl;
            } else {
              return list + ', ' + listEl;
            }
          }, '');

          let languagesHTML = '';
          for (const key in data[0].languages) {
            if (languagesHTML === '') {
              languagesHTML = data[0].languages[key];
            } else {
              languagesHTML = languagesHTML + ', ' + data[0].languages[key];
            }
          }

          countryList.innerHTML = '';
          countryInfo.innerHTML = `
        <p><img  width="48" src="${data[0].flags.svg}" alt="${data[0].name.official}"/><span> <b>${data[0].name.official}</b></span></p>       
<p><b>Capital: </b>${capitalHTML}</p>
<p><b>population: </b>${data[0].population}</p> 
<p><b>Languages: </b>${languagesHTML}</p>`;
        }
        if (arLength > 1 && arLength < 11) {
          const countryHTML = data.reduce((list, listEl) => {
            return (
              list +
              `<li><img  width="48" src="${listEl.flags.svg}" alt="${listEl.name.official}"/><span> ${listEl.name.official}</span></li>`
            );
          }, '');

          countryInfo.innerHTML = '';
          countryList.innerHTML = countryHTML;
        }
        if (arLength > 10) {
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
      })
      .catch(error => {
        if (error.message === 'not404') {
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
  }
}
const throttledonFilter = debounce(onFilter, DEBOUNCE_DELAY);
inputEl.addEventListener('input', throttledonFilter);
