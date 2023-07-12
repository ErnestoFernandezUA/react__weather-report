import { WeatherAverage } from "./Weather";

export interface CityData {
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
  weather?: WeatherAverage;
}
