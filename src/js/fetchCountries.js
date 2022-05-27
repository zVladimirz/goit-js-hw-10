const handleError = response => {
  if (!response.ok) {
    throw Error('not404');
  } else {
    return response.json();
  }
};

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(handleError);
}

export { fetchCountries };
