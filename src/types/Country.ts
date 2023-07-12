export interface CountriesXML {
  geonames: {
    country: { 
      countryName: {_text: string}; 
      countryCode: {_text: string};
    }[];
  };
}
