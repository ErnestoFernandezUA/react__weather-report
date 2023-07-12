const TIME_TO_LIVE = 5 * 60 * 1000;

export const isExpired = (timer?: string) => {
  if (!timer) {
    return true;
  }

  // console.log((Date.now() - Number(timer)) / 1000, Date.now() - Number(timer) > TIME_TO_LIVE );

  return Date.now() - Number(timer) > TIME_TO_LIVE
};
