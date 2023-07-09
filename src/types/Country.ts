export type Country = {
  countryName: string;
  countryCode: string;
  cities?: string[];
}


export interface CountryXML {
  geonames: {
    country: { 
      countryName: {_text: string}; 
      countryCode: {_text: string}
    }[];
  };
}