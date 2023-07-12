import { TIME_TO_LIVE } from "./constants";

export const isExpired = (timer?: string) => {
  if (!timer) {
    return true;
  }

  return Date.now() - Number(timer) > TIME_TO_LIVE
};
