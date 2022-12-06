import { SNIPER_ACTION_TYPE, TICKER_TYPE } from 'src/common/config';

// export const getActionType = (action: string) => {
//   const toLower = action.toLowerCase();
//   if (toLower.includes(`sale`)) {
//     return TICKER_TYPE.SALE;
//   }

//   if (toLower.includes(`cancel`)) {
//     return TICKER_TYPE.UNLISTINGS;
//   }
//   else {
//     if (toLower.includes(`list`)) {
//       return TICKER_TYPE.LISTINGS;
//     }
//   }

//   return ``;
// };

export const getActionType = (action: string) => {
  const toLower = action.toLowerCase();
  if (toLower == SNIPER_ACTION_TYPE.SALE) {
    return TICKER_TYPE.SALE;
  }

  if (toLower == SNIPER_ACTION_TYPE.CANCEL_LISTING) {
    return TICKER_TYPE.UNLISTINGS;
  }
  else {
    if (toLower == SNIPER_ACTION_TYPE.LISTING) {
      return TICKER_TYPE.LISTINGS;
    }
  }

  return ``;
};

export const getActionColor = (action: string) => {
  const toLower = action.toLowerCase();
  if (toLower == SNIPER_ACTION_TYPE.SALE) {
    return `success`;
  }

  if (toLower == SNIPER_ACTION_TYPE.CANCEL_LISTING) {
    return `default`;
  }
  else {
    if (toLower == SNIPER_ACTION_TYPE.LISTING) {
      return `warning`;
    }
  }

  return `default`;
};
