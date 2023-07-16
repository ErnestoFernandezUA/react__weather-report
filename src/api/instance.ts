import axios, { AxiosRequestConfig } from 'axios';

export const baseURL = 'https://api.open-meteo.com/v1';

export const instance = axios.create({
  baseURL,
});

export const client = {
  async get<T>(path: string, params?: AxiosRequestConfig) {
    const response = await instance.get<T>(path, params);

    console.log('get:', baseURL + path);

    return response.data;
  },
};
