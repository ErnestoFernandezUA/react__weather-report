export interface WeekWeather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: Hourly;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface Daily {
  time: Date[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface DailyUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

export interface Hourly {
  time: string[];
  winddirection_10m: number[];
}

export interface HourlyUnits {
  time: string;
  winddirection_10m: string;
}
