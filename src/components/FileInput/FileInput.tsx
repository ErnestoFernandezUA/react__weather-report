import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as convert from 'xml-js';

import { CityData } from '../../types/City';
import { CountriesXML } from '../../types/Country';

const FILTER_BY_POPULATION = 100000;

interface AllCountryData {
  data: { [key: string]: CityData[] };
  keys: { value: string; label: string }[];
}

interface LineData {
  id: number;
  value: string;
}

const FileInput = () => {
  const [jsonData, setJsonData] = useState<LineData[] | null>(null);
  const [
    result,
    setResult,
  ] = useState<AllCountryData | null>(null);

  useEffect(() => {
    const prepareData = async () => {
      let allCountryData: AllCountryData = {
        data: {},
        keys: [],
      };

      const loadCountriesNames = async () => {
        try {
          const responseXML = await axios.get(
            'http://api.geonames.org/countryInfo?username=efernandez',
            { responseType: 'text' },
          );
          const resultJSON = convert
            .xml2js(responseXML.data, { compact: true }) as CountriesXML;

          const namesCountry = resultJSON.geonames.country.map((el) => ({
            // eslint-disable-next-line no-underscore-dangle
            countryName: el.countryName._text,
            // eslint-disable-next-line no-underscore-dangle
            countryCode: el.countryCode._text,
          }));

          return namesCountry;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error during loading countries:', error);

          return undefined;
        }
      };

      const countryNames = await loadCountriesNames();

      const data: CityData[] | undefined = jsonData?.map(el => {
        const values = el.value.split('\t');
        const [
          geoNameId,
          name,
          asciiName,
          alternateNames,
          latitude,
          longitude,
          featureClass,
          featureCode,
          countryCode,
          cc2,
          admin1,
          admin2,
          admin3,
          admin4,
          population,
          elevation,
          dem,
          timeZone,
          modificationDate,
        ] = values;

        return {
          geoNameId,
          name,
          asciiName,
          alternateNames,
          latitude,
          longitude,
          featureClass,
          featureCode,
          countryCode,
          cc2,
          admin1,
          admin2,
          admin3,
          admin4,
          population,
          elevation,
          dem,
          timeZone,
          modificationDate,
        };
      });

      if (!data) {
        return;
      }

      for (let i = 0; i < data.length; i += 1) {
        if (Number(data[i].population) > FILTER_BY_POPULATION) {
          if (!allCountryData.data[data[i].countryCode]) {
            allCountryData.data[data[i].countryCode] = [data[i]];
            allCountryData.keys.push({
              value: data[i].countryCode,
              label: countryNames?.find(el => el.countryCode === data[i].countryCode)?.countryName || `country ${data[i].countryCode} not found`,
            });
          } else {
            allCountryData.data[data[i].countryCode].push(data[i]);
          }
        }
      }

      const sortedData: { [key: string]: CityData[] } = {};

      Object.keys(allCountryData.data).forEach(key => {
        sortedData[key] = allCountryData.data[key]
          .sort((a, b) => Number(b.population) - Number(a.population));
      });

      const sortedKeys = allCountryData.keys
        .sort((a, b) => a.label.localeCompare(b.label));

      allCountryData = {
        data: sortedData,
        keys: sortedKeys,
      };

      setResult(allCountryData);
    };

    prepareData();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const lines = (event.target.result as string).split('\n');
          const json = lines.map((line, index) => ({ id: index, value: line }));

          setJsonData(json);
        }
      };

      reader.onerror = (event) => {
        if (event.target && event.target.error) {
          // eslint-disable-next-line no-console
          console.error(
            `File could not be read! Code ${event.target.error.message}`,
          );
        }
      };

      reader.readAsText(file, 'UTF-8');
    }
  };

  const saveFile = () => {
    const jsonString = JSON.stringify(result);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'filename.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <input type="file" onChange={handleFile} accept=".txt" />
      <button onClick={saveFile} type="button">Save as JSON</button>
      {/* <pre>{jsonData && JSON.stringify(jsonData, null, 2)}</pre> */}
    </div>
  );
};

export default FileInput;
