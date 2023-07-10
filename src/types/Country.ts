// export type CountryType = {
//   countryName: string;
//   countryCode: string;
//   geonameId: string;
// }


export interface CountriesXML {
  geonames: {
    country: { 
      countryName: {_text: string}; 
      countryCode: {_text: string};
      // geonameId: {_text: string};
    }[];
  };
}
