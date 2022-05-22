export default class CountryApiService {
    constructor() {
        this.searchQuery = '';
     }

 fetchCountries() {
     return fetch(`https://restcountries.com/v2/name/${this.searchQuery}?fields=name,capital,population,flags,languages`)
         .then(response => {
             if (!response.ok) {
                 throw new Error(response.status);
             }
             return response.json();
         });
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}