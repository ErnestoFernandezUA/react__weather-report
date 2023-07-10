import React, { useEffect, useState } from "react";
import { CityFullData } from "../../types/City";
import axios from "axios";
import * as convert from 'xml-js';
import { CountriesXML } from "../../types/Country";

const FILTER_BY_POPULATION = 100000;

interface LineData {
  id: number;
  value: string;
}

const FileInput = () => {
  const [jsonData, setJsonData] = useState<LineData[] | null>(null);
  const [result, setResult] = useState<any>();
  useEffect(() => {
    const prepareData = async () => {
      console.log('local clear');
  
      let countryObject: { 
        data: { [key: string]: CityFullData[] }; 
        keys: { value: string; label: string }[]; 
      } = {
        data: {},
        keys: [],
      };
      
      const loadCountriesNames = async () => {
        try {
          const responseXML = await axios.get('http://api.geonames.org/countryInfo?username=efernandez', { responseType: 'text' });
          const resultJSON = convert.xml2js(responseXML.data, { compact: true }) as CountriesXML;
      
          const namesCountry = resultJSON.geonames.country.map((el) => ({
            countryName: el.countryName._text,
            countryCode: el.countryCode._text,
          }));
      
          return namesCountry;
        } catch (error) {
          console.error('Error during loading countries:', error);
        }
      };
    
      const countryNames = await loadCountriesNames();
  
      const data: CityFullData[] | undefined = jsonData?.map(el => {
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
      })
      
      if (!data) {
        return;
      }

      for (let i = 0; i < data.length; i++) {
        if (Number(data[i].population) > FILTER_BY_POPULATION) {
          if (!countryObject.data[data[i].countryCode]) {
            countryObject.data[data[i].countryCode] = [data[i]];
            countryObject.keys.push({
              value: data[i].countryCode,
              label: countryNames?.find(el => el.countryCode === data[i].countryCode)?.countryName || `country ${data[i].countryCode} not found`,
            });
          } else {
            countryObject.data[data[i].countryCode].push(data[i]);
          }
        }
      }
  
      const sortedData: { [key: string]: CityFullData[] } = {};
  
      for (const key in countryObject.data) {
        sortedData[key] = countryObject.data[key]
          .sort((a, b) => Number(b.population) - Number(a.population));
      }
  
      const sortedKeys = countryObject.keys.sort((a, b) => a.label.localeCompare(b.label));
  
      countryObject = { 
        data: sortedData,
        keys: sortedKeys,
      };
  
      setResult(countryObject);
    }
  
    prepareData();
  }, [])
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        console.log('reader.onload');

        if (event.target && event.target.result) {
          const lines = (event.target.result as string).split("\n");
          const json = lines.map((line, index) => ({ id: index, value: line }));

          console.log('setJson');
          setJsonData(json);
        }
      };

      reader.onerror = function (event) {
        console.log('reader.onerror');

        if (event.target && event.target.error) { 
          console.error("File could not be read! Code " + event.target.error.message);
        }
      };

      reader.readAsText(file, "UTF-8");
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
  }

  return (
    <div>
      <input type="file" onChange={handleFile} accept=".txt" />
      <button onClick={saveFile}>Save as JSON</button>
      {/* <pre>{jsonData && JSON.stringify(jsonData, null, 2)}</pre> */}
    </div>
  );
};

export default FileInput;
