import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, COLLECTION_ANALYSTIC_PERIOD } from "src/common/config";

const getTimeBefore = async (mode: number): Promise<number | null> => {
  const nowStamp = new Date().getTime();

  switch (mode) {
    case COLLECTION_ANALYSTIC_PERIOD.DAY:
      return nowStamp - (COLLECTION_ANALYSTIC_PERIOD.DAY * 60 * 60 * 1000);
    case COLLECTION_ANALYSTIC_PERIOD.MONTH:
      return nowStamp - (COLLECTION_ANALYSTIC_PERIOD.MONTH * 24 * 60 * 60 * 1000);
    case COLLECTION_ANALYSTIC_PERIOD.WEEK:
      return nowStamp - (COLLECTION_ANALYSTIC_PERIOD.WEEK * 24 * 60 * 60 * 1000);
    case COLLECTION_ANALYSTIC_PERIOD.ALL:
      return nowStamp - (COLLECTION_ANALYSTIC_PERIOD.ALL * 60 * 60 * 1000);
    case COLLECTION_ANALYSTIC_PERIOD.HOUR:
      return nowStamp - (COLLECTION_ANALYSTIC_PERIOD.HOUR * 60 * 60 * 1000);

    default:
      return null;
  }
}

export default getTimeBefore; 