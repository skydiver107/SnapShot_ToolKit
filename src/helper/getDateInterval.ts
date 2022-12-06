import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, COLLECTION_ANALYSTIC_PERIOD } from "src/common/config";

export interface IntervalType {
  openTimestamp: number,
  closeTimestamp: number
}

export const getDiffDates = (start: number, end: number): number => {
  try {
    const diffTime = Math.abs(start - end);
    const diffDates = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDates;
  }
  catch (err) {
    console.log(`err get diff of dates`, err)
    return 0;
  }
}

const getDatesInterval = async (mode: number, startTime?: number): Promise<IntervalType[]> => {
  let result = [];
  const now = new Date();

  switch (mode) {
    case COLLECTION_ANALYSTIC_PERIOD.DAY:
      const calcTime = now.getTime() - (COLLECTION_ANALYSTIC_PERIOD.DAY * 60 * 60 * 1000);
      result = new Array(COLLECTION_ANALYSTIC_PERIOD.DAY).fill(undefined).map((hour, index) => {
        let openTemp = new Date((calcTime + ((index + 1) * 60 * 60 * 1000)));
        let closeTemp = new Date((calcTime + ((index + 1) * 60 * 60 * 1000)));
        openTemp.setUTCMinutes(0);
        openTemp.setUTCSeconds(0);
        openTemp.setUTCMilliseconds(0);
        const openTimestamp = new Date(openTemp).getTime();
        closeTemp.setUTCMinutes(59);
        closeTemp.setUTCSeconds(59);
        closeTemp.setUTCMilliseconds(999);
        const closeTimestamp = new Date(closeTemp).getTime();

        return {
          openTimestamp: openTimestamp,
          closeTimestamp: closeTimestamp
        }
      });

      break;
    case COLLECTION_ANALYSTIC_PERIOD.MONTH:
      result = new Array(mode + 1).fill(undefined).map((date, index) => {
        let openTemp = new Date((now.getTime() - (mode - index) * 24 * 60 * 60 * 1000));
        let closeTemp = new Date((now.getTime() - (mode - index) * 24 * 60 * 60 * 1000));

        openTemp.setUTCHours(0);
        openTemp.setUTCMinutes(0);
        openTemp.setUTCSeconds(0);
        openTemp.setUTCMilliseconds(0);
        const openTimestamp = new Date(openTemp).getTime();
        closeTemp.setUTCHours(23);
        closeTemp.setUTCMinutes(59);
        closeTemp.setUTCSeconds(59);
        closeTemp.setUTCMilliseconds(999);
        const closeTimestamp = new Date(closeTemp).getTime();
        return {
          openTimestamp: openTimestamp,
          closeTimestamp: closeTimestamp
        }
      });
      break;
    case COLLECTION_ANALYSTIC_PERIOD.WEEK:
      result = new Array(mode + 1).fill(undefined).map((date, index) => {
        let openTemp = new Date((now.getTime() - (mode - index) * 24 * 60 * 60 * 1000));
        let closeTemp = new Date((now.getTime() - (mode - index) * 24 * 60 * 60 * 1000));

        openTemp.setUTCHours(0);
        openTemp.setUTCMinutes(0);
        openTemp.setUTCSeconds(0);
        openTemp.setUTCMilliseconds(0);
        const openTimestamp = new Date(openTemp).getTime();
        closeTemp.setUTCHours(23);
        closeTemp.setUTCMinutes(59);
        closeTemp.setUTCSeconds(59);
        closeTemp.setUTCMilliseconds(999);
        const closeTimestamp = new Date(closeTemp).getTime();
        return {
          openTimestamp: openTimestamp,
          closeTimestamp: closeTimestamp
        }
      });

      break;
    case COLLECTION_ANALYSTIC_PERIOD.ALL:
      if (startTime === undefined) {
        startTime = now.getTime();
      }
      const diffDates = getDiffDates(now.getTime(), startTime);
      result = new Array(diffDates + 1).fill(undefined).map((date, index) => {
        let openTemp = new Date((now.getTime() - (diffDates - index) * 24 * 60 * 60 * 1000));
        let closeTemp = new Date((now.getTime() - (diffDates - index) * 24 * 60 * 60 * 1000));

        openTemp.setUTCHours(0);
        openTemp.setUTCMinutes(0);
        openTemp.setUTCSeconds(0);
        openTemp.setUTCMilliseconds(0);
        const openTimestamp = new Date(openTemp).getTime();
        closeTemp.setUTCHours(23);
        closeTemp.setUTCMinutes(59);
        closeTemp.setUTCSeconds(59);
        closeTemp.setUTCMilliseconds(999);
        const closeTimestamp = new Date(closeTemp).getTime();
        return {
          openTimestamp: openTimestamp,
          closeTimestamp: closeTimestamp
        }
      });
      break;

    default:
      break;
  }

  return result;
}

export default getDatesInterval; 