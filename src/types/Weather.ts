interface Daily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

interface Hourly {
  time: string[];
  winddirection_10m: number[];
}

interface HourlyUnits {
  time: string;
  winddirection_10m: string;
}

export interface WeatherData {
  daily: Daily;
  daily_units: DailyUnits;
  elevation: number;
  generationtime_ms: number;
  hourly: Hourly;
  hourly_units: HourlyUnits;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
