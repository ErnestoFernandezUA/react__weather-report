// export interface CityType {
//   name: string;
//   countryName: string; 
//   countryCode: string;
//   geonameId: string;
//   lat: string;
//   lng: string;
// }

// export interface CitiesXML {
//   geonames: {
//     geoname: { 
//       countryName: {_text: string}; 
//       countryCode: {_text: string};
//       name: {_text: string};
//       geonameId: {_text: string};
//       lat: {_text: string};
//       lng: {_text: string};
//     }[];
//   },
//   totalResultsCount: {_text: string}; 
// }

export interface CityFullData {
  geoNameId: string; 
  name: string; 
  asciiName: string;
  alternateNames: string;
  latitude: string;
  longitude: string;
  featureClass: string;
  featureCode: string;
  countryCode: string;
  cc2: string;
  admin1: string;
  admin2: string;
  admin3: string;
  admin4: string;
  population: string;
  elevation: string;
  dem: string;
  timeZone: string;
  modificationDate: string;
}