import React, { Fragment, useEffect, useRef, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import moment from 'moment';

import { RootState } from "redux/store";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { Avatar, Grid, Hidden } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';

import { getMarketplace, getMarketplaceImage } from "src/common/services/getMarketplace";
import { numberToFix, parseNumber } from "src/common/utils/helpers";
import { getActionType, getActionColor } from "src/helper/getActionType";
import getCollectionName from "src/helper/getCollectionName"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, MARKET_ANALYSTIC_PERIOD, LIMIT_PAGE_SIZE, ACTION_TYPE, SNIPER_API, CORS_PROXY_SERVER, SNIPER_ACTION_TYPE, TrendsField } from "src/common/config";
import WhiteCircle from 'src/components/IconButton/WhiteCircle';
import WhiteDown from 'src/components/IconButton/WhiteDown';
import WhiteUp from "@components/IconButton/WhiteUp";
import fetchData from "src/common/services/getDataWithAxios";
import { delayTime, useInterval } from "src/helper/utility";

import { handleImageError } from "src/common/utils/handleImageError";

import PaperButton from "src/components/PaperButton";
import PageInfo from "@components/PageContainer/PageInfo";
import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';
import AddMarket from "@components/IconButton/AddMarket";
import ZoomGlass from "@components/IconButton/ZoomGlass";
import { truncateSync } from "fs";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const trackFields: {
  menu: string,
  field: string,
  isStatistic: boolean,
  isLamport: boolean,
  type: TrendsField | null
}[] = [
    {
      menu: `project`,
      field: `name`,
      isStatistic: false,
      isLamport: false,
      type: null
    },
    {
      menu: `listed`,
      field: `listed`,
      isStatistic: false,
      isLamport: false,
      type: TrendsField.LIST
    },
    {
      menu: `ratio`,
      field: `listRatio`,
      isStatistic: true,
      isLamport: false,
      type: TrendsField.LIST
    },
    {
      menu: `floor`,
      field: `floor`,
      isStatistic: false,
      isLamport: true,
      type: TrendsField.FLOOR
    },
    {
      menu: `% change`,
      field: `floorChange`,
      isStatistic: true,
      isLamport: true,
      type: TrendsField.FLOOR
    },
    {
      menu: `volume`,
      field: `volume24hr`,
      isStatistic: false,
      isLamport: true,
      type: TrendsField.VOLUME
    },
    {
      menu: `% change`,
      field: `volume24hrChange`,
      isStatistic: true,
      isLamport: false,
      type: TrendsField.VOLUME
    }
  ];

const tickerFields: {
  title: String,
  hiddenItem: boolean
}[] = [
    { title: `project`, hiddenItem: true },
    { title: `name`, hiddenItem: false },
    { title: `price`, hiddenItem: false },
    { title: `type`, hiddenItem: true },
    { title: `time`, hiddenItem: false },
    { title: `link`, hiddenItem: false },
  ];

const hightestSales: {
  title: String,
  hiddenItem: boolean
}[] = [
    { title: `project`, hiddenItem: true },
    { title: `name`, hiddenItem: false },
    { title: `price`, hiddenItem: false },
    { title: `link`, hiddenItem: false }
  ]

const lowestListings: {
  title: String,
  hiddenItem: boolean
}[] = [
    { title: `project`, hiddenItem: true },
    { title: `name`, hiddenItem: false },
    { title: `price`, hiddenItem: false },
    { title: `link`, hiddenItem: false }
  ]

let activityTempData: any[] | null = null;
let tempOriginalTickerData = [];
let globalPeriod = MARKET_ANALYSTIC_PERIOD.HOUR;

const market = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const mainTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  // For TopTrends
  const [myTracksData, setMyTracksData] = useState<any[] | null>(null);
  const [percentChange, setPercentChange] = useState<any[] | null>(null);
  const [loadedPercent, setLoadedPercent] = useState<boolean>(true);

  // For Ticker mode
  const [tickerModes, setTickerModes] = useState<string[]>([SNIPER_ACTION_TYPE.LISTING, SNIPER_ACTION_TYPE.SALE]);

  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);

  const [period, setPeriod] = useState<number>(MARKET_ANALYSTIC_PERIOD.HOUR);

  const [originalTickerData, setOriginalTickerData] = useState<any[]>([]);
  const [originalTickerChanged, setOriginalTickerChanged] = useState<boolean>(true);
  const [tickerData, setTickerData] = useState<any[]>([]);
  const [tickerTempInterval, setTickerTempInterval] = useState<number>(0);
  const [tickerOneInterval, setTickerOneInterval] = useState<number>(0);
  const [hyperInterval, setHyperInterval] = useState<number>(0);

  const [highestSalesData, setHightestSalesData] = useState<any[]>([]);
  const [lowestListingsData, setLowestListingsData] = useState<any[]>([]);

  const [statistic, setStatistic] = useState<{ sales: number, listings: number, delistings: number }>({
    sales: 0,
    listings: 0,
    delistings: 0
  });

  const [sortMode, setSortMode] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>('volume24hr');

  // For Real time fetching
  const [timer, setTimer] = React.useState(null);

  const [loadingTicker, setLoadingTicker] = useState<boolean>(true);
  const [loadingHightest, setLoadingHightest] = useState<boolean>(false);
  const [getHightest, setGetHightest] = useState<boolean>(false);
  const [loadingLowest, setLoadingLowest] = useState<boolean>(false);
  const [getLowest, setGetLowest] = useState<boolean>(false);

  const [visibleTrendFields, setVisibleTrendsField] = useState<TrendsField>(TrendsField.LIST);

  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsShowMessage(false);
  };

  const getPercentChange = async () => {
    try {
      new Promise((myResolve, myReject) => {
        const fetched: any = fetchData({
          method: `get`,
          route: `${DATA_API.GET_TOP_TRENDS}`
        });

        myResolve(fetched);
      }).then((res: any) => {
        let result: any = res;
        if (result && Array.isArray(result)) {
          setPercentChange([...result]);
          setLoadedPercent(!loadedPercent);
        }
      });
    }
    catch (err) {

    }
  }

  const sortData = async (field: string) => {
    if (field) {
      const tempMyTrackData = myTracksData;
      tempMyTrackData.sort((a: any, b: any) => {
        if (field == `name`) {
          return sortMode ? ('' + a[`name`]).localeCompare(b[`name`]) : ('' + b[`name`]).localeCompare(a[`name`]);
        }
        else {
          return sortMode ? (a[field] - b[field]) : (b[field] - a[field]);
        }
      });
      setMyTracksData([...tempMyTrackData]);
      setSortField(field);
      setSortMode(!sortMode);
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Invalid Field! Please try again.`);
      setMessageSeverity(`warning`);
    }
  }

  const getTickerData = async () => {
    try {
      setLoadingTicker(true);
      const fetched: any = await fetchData({
        method: `get`,
        route: `${DATA_API.MARKET_HYPE.COMMON}${DATA_API.MARKET_HYPE.TICKERS}`
      });

      let result: any = fetched;
      if (result && Array.isArray(result)) {
        result.sort((a: any, b: any) => {
          return (new Date(b?.time).getTime()) - (new Date(a?.time).getTime());
        })
        activityTempData = [...result];

        getHighestData();
        getLowestData();
        const cutData = activityTempData.filter((record: any, index: number) => index < 50);
        setOriginalTickerData([...cutData]);
        tempOriginalTickerData = [...cutData];
        setOriginalTickerChanged(!originalTickerChanged);
      }
      setLoadingTicker(false);
    }
    catch (err) {

    }
  }

  const getHighestData = async () => {
    if (!getHightest) {
      setLoadingHightest(true);
    }

    const fetched: any = await fetchData({
      method: `get`,
      route: `${DATA_API.MARKET_HYPE.COMMON}${DATA_API.MARKET_HYPE.HIGHEST}`
    });

    if (fetched && Array.isArray(fetched)) {
      const temp = fetched.sort((a: any, b: any) => {
        return b?.price - a?.price;
      }).filter((record: any, index: number) => index < (LIMIT_COLUMNS));
      setLoadingHightest(false);
      setGetHightest(true);
      if (temp.length > 0) {
        setHightestSalesData([...temp]);
      }
    }
  }

  const getLowestData = async () => {
    if (!getLowest) {
      setLoadingLowest(true);
    }

    const fetched: any = await fetchData({
      method: `get`,
      route: `${DATA_API.MARKET_HYPE.COMMON}${DATA_API.MARKET_HYPE.LOWEST}`
    });

    if (fetched && Array.isArray(fetched)) {
      const temp = fetched.sort((a: any, b: any) => {
        return a?.price - b?.price;
      }).filter((record: any, index: number) => index < (LIMIT_COLUMNS));
      setLoadingLowest(false);
      setGetLowest(true);
      if (temp.length > 0) {
        setLowestListingsData([...temp]);
      }
    }
  }

  const getNewTickerOne = async () => {
    if (activityTempData && tempOriginalTickerData[0]) {
      const lastTicker: any = tempOriginalTickerData[0];
      const index = activityTempData.findIndex((val: any) => { return val?.transaction_sig == lastTicker?.transaction_sig });
      if (index == -1) {
        return activityTempData[activityTempData.length - 1] || null;
      }
      else if (index == 0) {
        return null;
      } else {

        return activityTempData[index - 1] || null;
      }
    }

    if (activityTempData && tempOriginalTickerData.length < 1) {
      return activityTempData[activityTempData.length - 1] || null;
    }
  }

  const fetchInterval = () => {
    try {
      getLowestData();
      getHighestData();
    } catch (error) {

    } finally {

    }
  }

  const fetchTickerTempInterval = async () => {
    const id = window.setInterval(async () => {
      setTickerTempInterval(tickerTempInterval => tickerTempInterval + 0.000000001);
    }, (10000))
    return id;
  }

  const fetchTickerOneInterval = async () => {
    const id = window.setInterval(async () => {
      setTickerOneInterval(tickerOneInterval => tickerOneInterval + 0.000000001);
    }, TIME_RANGE / 40)
    return id;
  }

  const fetchHyperInterval = async () => {
    const id = window.setInterval(async () => {
      setHyperInterval(hyperInterval => hyperInterval + 1);
    }, (TIME_RANGE * 6))
    return id;
  }

  useEffect(() => {
    activityTempData = null;
    tempOriginalTickerData = [];
    globalPeriod = MARKET_ANALYSTIC_PERIOD.HOUR;
    (async () => {
      getTickerData();
      fetchHyperInterval();
      let tickerInterval = await fetchTickerTempInterval();
      fetchTickerOneInterval();

      return () => clearInterval(tickerInterval);
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (!loadingTicker) {
        new Promise((myResolve, myReject) => {
          const fetched: any = fetchData({
            method: `get`,
            route: `${DATA_API.MARKET_HYPE.COMMON}${DATA_API.MARKET_HYPE.TICKERS}`
          });
          myResolve(fetched);
        }).then(async (res) => {
          let temp: any = res || [];
          if (temp && Array.isArray(temp)) {
            if (activityTempData) {
              let tempOrigin = activityTempData;
              let curSigs = tempOrigin.map((act: any) => { return act?.transaction_sig });

              let filtered = temp.filter((act: any) => {
                let isIn = curSigs.findIndex((signature: string) => { return act?.transaction_sig == signature });
                if (isIn > -1) {
                  return false;
                }
                else {
                  return true;
                }
              });
              if (filtered.length > 0) {
                let res = [...filtered, ...tempOrigin].sort((a: any, b: any) => {
                  return (new Date(b?.time).getTime()) - (new Date(a?.time).getTime());
                });

                if (res.length > 999) {
                  const diff = res.length - 999;
                  for (let i = 0; i < diff; i++) {
                    res.pop();
                  }
                }
                activityTempData = [...res];

                let tempData = tempOriginalTickerData;
                let result = activityTempData.sort((a: any, b: any) => {
                  return (new Date(b?.time).getTime()) - (new Date(a?.time).getTime());
                }).filter((record: any, index: number) => index < 50);
                setOriginalTickerData([...result]);
                tempOriginalTickerData = [...result];
                setOriginalTickerChanged(!originalTickerChanged);
              }
            }
          }
        });
      }
    })()
  }, [tickerTempInterval]);

  useEffect(() => {
    (async () => {
      fetchInterval();
      getPercentChange();
    })()
  }, [hyperInterval]);

  useEffect(() => {
    (async () => {
      let temp = tempOriginalTickerData;
      if (!tickerModes.some((mode: string) => { return mode == SNIPER_ACTION_TYPE.LISTING; })) {
        temp = temp.filter((act: any, index: number) => {
          return act?.type != SNIPER_ACTION_TYPE.LISTING
        })
      }
      if (!tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.CANCEL_LISTING); })) {
        temp = temp.filter((act: any, index: number) => {
          return act?.type != SNIPER_ACTION_TYPE.CANCEL_LISTING
        })
      }
      if (!tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.SALE); })) {
        temp = temp.filter((act: any, index: number) => {
          return act?.type != SNIPER_ACTION_TYPE.SALE
        })
      }
      temp = temp.filter((act: any, index: number) => {
        return act?.type != SNIPER_ACTION_TYPE.MINT
      }).sort((a: any, b: any) => {
        return (new Date(b?.time).getTime()) - (new Date(a?.time).getTime());
      });

      const saleData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.SALE
      });
      const listingData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.LISTING
      });
      const delistingData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.CANCEL_LISTING
      });
      const mintData = tempOriginalTickerData.filter((act: any, index: number) => {
        return act?.type == SNIPER_ACTION_TYPE.MINT
      });
      const all = tempOriginalTickerData?.length - mintData?.length;

      setStatistic({
        ...statistic,
        sales: saleData?.length / all || 0,
        listings: listingData?.length / all || 0,
        delistings: delistingData?.length / all || 0
      });
      if (activityTempData) {

      }

      setTickerData([...temp]);
    })()
  }, [tickerModes, originalTickerData, originalTickerChanged]);

  useEffect(() => {
    (async () => {
      globalPeriod = period;
      if (!loadingLowest) {
        getLowestData();
      }

      if (!loadingHightest) {
        getHighestData();
      }
    })()
  }, [period]);

  useEffect(() => {
    (async () => {
      if (percentChange) {
        let temp = percentChange.sort((a: any, b: any) => {
          if (sortField == `name`) {
            return sortMode ? ('' + a[`name`]).localeCompare(b[`name`]) : ('' + b[`name`]).localeCompare(a[`name`]);
          }
          else {
            return sortMode ? (a[sortField] - b[sortField]) : (b[sortField] - a[sortField]);
          }
        });

        setMyTracksData([...temp]);
      }
    })()
  }, [loadedPercent]);

  return (
    <>
      <PageInfo>
      </PageInfo>
      <Box component='section'
        sx={{
          display: `flex`,
          alignItems: `stretch`,
          justifyContent: `space-between`,
          mx: `auto`,
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
          py: 1.5,
          background: `none`,
          overflow: `hidden`,
          position: `relative`,
          '* td *, th *': {
            wordBreak: `break-word`
          }
        }}
      >
        <Grid item lg={6} > <Typography variant="h6" sx={{ color: theme => theme.palette.common.white }}>Trending Projects</Typography></Grid>
      </Box>

      <Box component='section'
        sx={{
          display: {
            ss: `flex`,
            sm: `none`
          },
          alignItems: `stretch`,
          justifyContent: `space-between`,
          mx: `auto`,
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
          pb: 1,
          background: `none`,
          overflow: `hidden`,
          position: `relative`,
          '* td *, th *': {
            wordBreak: `break-word`
          },
        }}
      >
        <ButtonGroup variant="contained" aria-label="outlined primary button group"
          sx={{
            '& .MuiButtonGroup-grouped': {
              borderRight: `none !important`,
            }
          }}
        >
          <PaperButton size={`medium`} selected={visibleTrendFields == TrendsField.LIST}
            sx={{
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4
            }}
            onClick={
              async () => {
                setVisibleTrendsField(TrendsField.LIST);
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              listed
            </Typography>
          </PaperButton>
          <PaperButton size={`medium`} selected={visibleTrendFields == TrendsField.FLOOR}
            onClick={
              async () => {
                setVisibleTrendsField(TrendsField.FLOOR);
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              floor
            </Typography>
          </PaperButton>
          <PaperButton size={`medium`} selected={visibleTrendFields == TrendsField.VOLUME}
            sx={{
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4
            }}
            onClick={
              async () => {
                setVisibleTrendsField(TrendsField.VOLUME);
              }
            }
          >
            <Typography
              variant={`subtitle2`}

            >
              volume
            </Typography>
          </PaperButton>
        </ButtonGroup>
      </Box>

      <Box component='section'
        sx={{
          mx: `auto`,
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
          background: `none`,
          position: `relative`
        }}
      >
        <TableContainer
          component={`div`}
          sx={{
            overflowX: `hidden`,
            overflowY: `auto`,
            position: `relative`,
            maxHeight: `50vh`
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead
            >
              <TableRow>
                <TableCell
                  sx={{
                    border: `none`,
                    width: `3%`,
                    background: theme => theme.palette.neutral.main,
                  }}
                >
                </TableCell>
                <TableCell
                  sx={{
                    background: theme => theme.palette.neutral.main,
                    border: `none`,
                  }}
                >
                </TableCell>
                {
                  trackFields?.map((menu: any, index: number) => {
                    return (
                      <TableCell
                        sx={{
                          background: theme => theme.palette.neutral.main,
                          border: `none`,
                          py: 1.5,
                          px: 1,
                          borderRight: {
                            ss: `none`,
                            sm: [2, 4].includes(index) ? theme => `solid 1px ${theme.palette.common.white}` : `none`,
                          },
                          display: {
                            ss: (menu?.type == visibleTrendFields || menu?.type == null) ? `table-cell` : `none`,
                            sm: `table-cell`
                          }
                        }}
                        key={index}
                      >
                        <Stack
                          direction={`row`}
                          alignItems={`center`}
                          justifyContent={
                            `center`
                          }
                        >
                          <Stack
                            direction={`column`}
                            alignItems={`center`}
                            justifyContent={`center`}
                          >
                            {
                              sortField == menu?.field ? (sortMode ?
                                <WhiteDown
                                  sx={{
                                    width: `1.5rem`,
                                    height: `1.5rem`,
                                    '&:hover': {
                                      cursor: `pointer`,
                                      opacity: 0.7
                                    },
                                    color: theme => theme.palette.common.white
                                  }}
                                  onClick={async () => {
                                    await sortData(menu?.field);
                                  }}
                                /> :
                                <WhiteUp
                                  sx={{
                                    width: `1.5rem`,
                                    height: `1.5rem`,

                                    '&:hover': {
                                      cursor: `pointer`,
                                      opacity: 0.7
                                    },
                                    color: theme => theme.palette.common.white
                                  }}
                                  onClick={async () => {
                                    await sortData(menu?.field);
                                  }}
                                />
                              ) :
                                <WhiteCircle
                                  sx={{
                                    width: `1.5rem`,
                                    height: `1.5rem`,
                                    '&:hover': {
                                      cursor: `pointer`,
                                      opacity: 0.7
                                    },
                                    color: theme => theme.palette.common.white,
                                    fill: `none`,
                                    stroke: theme => theme.palette.common.white,
                                  }}
                                  onClick={async () => {
                                    await sortData(menu?.field);
                                  }}
                                />
                            }
                            <Typography variant={`subtitle2`} sx={{ mt: 0.5, color: theme => theme.palette.common.white }}>
                              {menu.menu}
                            </Typography>

                          </Stack>
                        </Stack>
                      </TableCell>
                    );
                  })
                }
                <TableCell
                  sx={{
                    background: theme => theme.palette.neutral.main,
                    border: `none`,
                    width: `3%`
                  }}
                >
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                myTracksData ?
                  (
                    myTracksData?.map((track: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': {
                            cursor: `pointer`
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            border: `none`,
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <Box
                            component={`img`}
                            src={track?.image}
                            sx={{
                              width: `36px`,
                              height: `36px`,
                              borderRadius: `50%`
                            }}
                            onError={handleImageError}
                          >
                          </Box>
                        </TableCell>
                        {
                          trackFields?.map((field: any, _index: number) => {
                            return (
                              <TableCell
                                align="center"
                                key={_index}
                                sx={{
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  borderRight: {
                                    ss: `none`,
                                    xs: `none`,
                                    sm: [2, 4].includes(_index) ? theme => `solid 1px ${theme.palette.neutral.main}` : `none`,

                                  },
                                  background: theme => theme.palette.neutral.common,
                                  px: 1,
                                  py: 1,
                                  display: {
                                    ss: (field?.type == visibleTrendFields || field?.type == null) ? `table-cell` : `none`,
                                    sm: `table-cell`
                                  }
                                }}
                              >

                                <Stack
                                  direction={`row`}
                                  alignItems={`center`}
                                  justifyContent={
                                    `center`
                                  }
                                >
                                  <Box
                                    sx={{
                                      display: `flex`,
                                      alignItems: `center`,
                                      justifyContent: `center`
                                    }}
                                  >
                                    {
                                      field?.isStatistic && track[field?.field] != undefined && field?.field != `listRatio` && track[field?.field] > 0 && <GreenUp sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} />
                                    }

                                    {
                                      field?.isStatistic && track[field?.field] != undefined && field?.field != `listRatio` && track[field?.field] < 0 && <RedDown sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} />
                                    }

                                    <Typography variant={`subtitle2`} color={`inherit`}>
                                      {
                                        field?.field == `name` && track?.project?.display_name
                                      }

                                      {
                                        field?.isStatistic && track[field?.field] != undefined && `${numberToFix(parseNumber(track[field?.field] * 100))}%`
                                      }

                                      {
                                        (!field.isStatistic && !field.isLamport && track[field.field] != undefined && !isNaN(parseFloat(track[field.field]))) ? parseInt(track[field.field]) : ``
                                      }

                                      {
                                        !field?.isStatistic && !field?.isLamport && track[field?.field] != undefined && isNaN(parseFloat(track[field?.field])) && track[field?.field]
                                      }

                                      {
                                        !field?.isStatistic && field?.isLamport && track[field?.field] != undefined &&
                                        <>
                                          {`${numberToFix((track[field?.field] / LAMPORTS_PER_SOL))}`}
                                          <Box
                                            component={`img`}
                                            src={`/images/icons/sol.svg`}
                                            sx={{
                                              ml: 1,
                                              pt: `3px`,
                                              width: `12px`,
                                              height: `12px`
                                            }}
                                            onError={handleImageError}
                                          >
                                          </Box>
                                        </>
                                      }
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                            );
                          })
                        }
                        <TableCell
                          sx={{
                            border: `none`,
                            background: theme => theme.palette.neutral.common,
                            px: 1,
                            py: 1
                          }}
                        > </TableCell>
                      </TableRow>
                    ))
                  ) :
                  (
                    new Array(10).fill(undefined).map((track: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': {
                            cursor: `pointer`
                          },
                        }}
                      >
                        <TableCell sx={{
                          border: `none`,
                          background: theme => theme.palette.neutral.common,
                          px: 1,
                          py: 1
                        }}> </TableCell>
                        <TableCell
                          sx={{
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            px: 1,
                            py: 1
                          }}
                        >
                          <Skeleton variant="circular" width={36} height={36} />
                        </TableCell>
                        {
                          trackFields?.map((field: any, _index: number) => {
                            return (
                              <TableCell
                                align="center"
                                key={_index}
                                sx={{
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  borderRight: {
                                    ss: `none`,
                                    sm: [2, 4].includes(_index) ? theme => `solid 1px ${theme.palette.neutral.main}` : `none`,

                                  },
                                  background: theme => theme.palette.neutral.common,
                                  px: 1,
                                  py: 1,
                                  display: {
                                    ss: (field?.type == visibleTrendFields || field?.type == null) ? `table-cell` : `none`,
                                    sm: `table-cell`
                                  }
                                }}
                              >

                                <Stack
                                  width={`100%`}
                                  direction={`row`}
                                  alignItems={`center`}
                                  justifyContent={
                                    `center`
                                  }
                                >
                                  <Box
                                    sx={{
                                      width: `100%`,
                                      display: `flex`,
                                      alignItems: `center`,
                                      justifyContent: `center`
                                    }}
                                  >
                                    <Typography variant={`subtitle2`} color={`inherit`} sx={{ width: `100%` }}>
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                            );
                          })
                        }
                        <TableCell
                          sx={{
                            border: `none`,
                            background: theme => theme.palette.neutral.common,
                            px: 1,
                            py: 1
                          }}
                        > </TableCell>
                      </TableRow>
                    ))
                  )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Grid
        container
        spacing={
          {
            ss: 0,
            lg: 2,
          }
        }
        direction={`row`}
        justifyContent={`space-between`}
        alignItems={`stretch`}
        sx={{
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
          mb: 4
        }} >

        <Grid item
          container
          ss={12}
          xs={12}
          sm={12}
          md={12}
          lg={7}
          direction="row"
          alignItems="stretch"
          justifyContent="flex-start"
        >
          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`,
              height: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{
              width: `100%`,
              borderRadius: '4px',
              py: 1.5,
            }} >
              <Grid>
                <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Tracker</Typography>
              </Grid>
              <Grid>
                <ButtonGroup>
                  <Box sx={{
                    background: tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.LISTING); }) ? theme => theme.palette.success.light : theme => theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    borderRadius: '4px 0px 0px 4px',
                    '&:hover': {
                      cursor: `pointer`
                    }
                  }}
                    onClick={() => {
                      if (tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.LISTING); })) {
                        const temp = tickerModes.filter((mode) => { return mode != (SNIPER_ACTION_TYPE.LISTING); });
                        setTickerModes([...temp])
                      }
                      else {
                        setTickerModes([...tickerModes, ...[SNIPER_ACTION_TYPE.LISTING]]);
                      }
                    }}
                  >
                    <Typography variant='subtitle2' sx={{
                      color: `white`
                    }}
                    >listings</Typography>
                  </Box>

                  <Box sx={{
                    background: tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.CANCEL_LISTING); }) ? theme => theme.palette.success.light : theme => theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    '&:hover': {
                      cursor: `pointer`
                    }
                  }}
                    onClick={() => {
                      if (tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.CANCEL_LISTING); })) {
                        const temp = tickerModes.filter((mode) => { return mode != (SNIPER_ACTION_TYPE.CANCEL_LISTING); });
                        setTickerModes([...temp])
                      }
                      else {
                        setTickerModes([...tickerModes, ...[SNIPER_ACTION_TYPE.CANCEL_LISTING]]);
                      }
                    }}
                  >
                    <Typography variant='subtitle2' sx={{
                      color: `white`
                    }}>delistings</Typography>
                  </Box>

                  <Box sx={{
                    background: tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.SALE); }) ? theme => theme.palette.success.light : theme => theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    borderRadius: '0px 4px 4px 0px',
                    '&:hover': {
                      cursor: `pointer`
                    }
                  }}
                    onClick={() => {
                      if (tickerModes.some((mode: string) => { return mode == (SNIPER_ACTION_TYPE.SALE); })) {
                        const temp = tickerModes.filter((mode) => { return mode != (SNIPER_ACTION_TYPE.SALE); });
                        setTickerModes([...temp])
                      }
                      else {
                        setTickerModes([...tickerModes, ...[SNIPER_ACTION_TYPE.SALE]]);
                      }
                    }}
                  >
                    <Typography variant='subtitle2' sx={{
                      color: `white`
                    }}>sales</Typography>
                  </Box>
                </ButtonGroup>
              </Grid>
            </Stack>

            <TableContainer
              component={`div`}
              sx={{
                overflowX: `hidden`,
                overflowY: `auto`,
                position: `relative`,
                minHeight: `100vh`,
                maxHeight: `100vh`,
                '& *': {
                  transition: `all 1000ms ease-in-out`
                }
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        width: '3%',
                        border: `none`,
                        background: theme => theme.palette.neutral.main
                      }}
                    ></TableCell>
                    <TableCell
                      sx={{
                        border: `none`,
                        background: theme => theme.palette.neutral.main,
                        display: {
                          ss: `none`,
                          sm: `table-cell`
                        }
                      }}
                    >
                    </TableCell>
                    {
                      tickerFields?.map((menu: any, index: number) => {
                        return (
                          <TableCell
                            sx={{
                              width: {
                                ss: index < 2 ? (index < 1 ? `25%` : `30%`) : `auto`,
                                sm: index < 2 ? (index < 1 ? `18%` : `23%`) : `auto`,
                              },
                              background: theme => theme.palette.neutral.main,
                              border: `none`,
                              textAlign: 'center',
                              display: {
                                ss: menu.hiddenItem ? `none` : `table-cell`,
                                sm: `table-cell`
                              }
                            }}
                            key={index}
                          >
                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={
                                `center`
                              }
                            >
                              <Typography variant={`subtitle2`} sx={{ mt: 0.5, color: theme => theme.palette.common.white }}>
                                {menu.title}
                              </Typography>

                            </Stack>
                          </TableCell>
                        );
                      })
                    }
                    <TableCell
                      sx={{
                        width: '3%',
                        border: `none`,
                        background: theme => theme.palette.neutral.main,
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    !loadingTicker && tickerData?.map((ticker: any, index: number) => {
                      return <TableRow key={index}>
                        <TableCell sx={{
                          border: 'none',
                          background: theme => theme.palette.neutral.common,
                          p: 1,
                          py: 1
                        }} />
                        <TableCell
                          sx={{
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            display: {
                              ss: `none`,
                              sm: `table-cell`
                            }
                          }}
                        >
                          <Box
                            component={`img`}
                            src={ticker?.image}
                            sx={{
                              width: `36px`,
                              height: `36px`,
                              borderRadius: `50%`
                            }}
                            onError={handleImageError}
                          >
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: `center`,
                            display: {
                              ss: `none`,
                              sm: `table-cell`
                            }
                          }}
                        >
                          <Typography variant='subtitle2' >
                            {ticker?.collection_name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: `center`
                          }}
                        >
                          <Typography variant='subtitle2'>
                            {ticker?.name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1
                          }}
                        >
                          <Stack
                            direction={`row`}
                            alignItems={`center`}
                            justifyContent={`center`}
                          >
                            <Typography variant='subtitle2' >{(ticker?.price && ticker?.type != SNIPER_ACTION_TYPE.CANCEL_LISTING) && `${numberToFix(ticker?.price / LAMPORTS_PER_SOL)}`}</Typography>
                            {
                              (ticker?.price && ticker?.type != SNIPER_ACTION_TYPE.CANCEL_LISTING) &&
                              <Box
                                component={`img`}
                                src={`/images/icons/sol.svg`}
                                sx={{
                                  ml: 1,
                                  width: `12px`,
                                  height: `12px`
                                }}
                                onError={handleImageError}
                              >
                              </Box>
                            }
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: `center`,
                            display: {
                              ss: `none`,
                              sm: `table-cell`
                            }
                          }}
                        >
                          <Chip
                            label={ticker?.type && `${getActionType(ticker?.type)}`}
                            color={ticker?.type ? `${getActionColor(ticker?.type)}` : `default`}
                            sx={{
                              '& *': {
                                fontSize: `10px`,
                                color: theme => theme.palette.common.white,
                              },
                              height: `18px`,
                              borderRadius: `2px !important`
                            }}
                            size={`small`}
                          />

                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: `center`
                          }}
                        >
                          <Typography variant='subtitle2'>
                            {
                              `${`0${new Date(ticker?.time).getHours()}`.slice(-2)}:`
                            }
                            {
                              `${`0${new Date(ticker?.time).getMinutes()}`.slice(-2)}:`
                            }
                            {
                              `${`0${new Date(ticker?.time).getSeconds()}`.slice(-2)}`
                            }
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{
                            cursor: 'pointer'
                          }} >
                            <Link href={`${getMarketplace(ticker?.marketplace)}${ticker?.mint}`} passHref>
                              <a target="_blank">
                                <Box
                                  sx={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    justifyContent: `center`
                                  }}
                                >
                                  <Box
                                    component={`img`}
                                    src={`${getMarketplaceImage(ticker?.marketplace)}`}
                                    sx={{
                                      width: `36px`,
                                      height: `36px`,
                                      borderRadius: `50%`
                                    }}
                                    onError={handleImageError}
                                  >
                                  </Box>
                                </Box>
                              </a>
                            </Link>
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            background: theme => theme.palette.neutral.common,
                          }}
                        />
                      </TableRow>
                    })
                  }
                  {
                    loadingTicker && new Array(20).fill(undefined).map((val: any, index: number) => {
                      return <TableRow
                        key={index}
                      >
                        <TableCell sx={{
                          border: 'none',
                          background: theme => theme.palette.neutral.common,
                          p: 1,
                          py: 1
                        }} />

                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            display: {
                              ss: `none`,
                              sm: `table-cell`
                            }
                          }}
                        >
                          <Skeleton variant="circular" width={36} height={36} />
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            display: {
                              ss: `none`,
                              sm: `table-cell`
                            }
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}>
                            {
                              <Skeleton animation="wave" sx={{ width: `100%` }} />
                            }
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: 'center',
                            display: {
                              ss: `none`,
                              sm: `table-cell`
                            }
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ width: `100%` }}> <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: 'none',
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            p: 1,
                            py: 1,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{
                            cursor: 'pointer',
                            width: `100%`
                          }} > <Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        </TableCell>
                        <TableCell sx={{
                          border: 'none',
                          background: theme => theme.palette.neutral.common,
                          p: 1,
                          py: 1
                        }} ></TableCell>
                      </TableRow>
                    })
                  }
                </TableBody>
              </Table >
            </TableContainer >
          </Box >
        </Grid >

        <Grid item
          container
          ss={12}
          xs={12}
          sm={12}
          md={12}
          lg={5}
          direction="row"
          alignItems="stretch"
          justifyContent="flex-start"
        >
          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{
              py: 2.8
            }} >
              <Grid>
                <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Market Overview</Typography>
              </Grid>
            </Stack>

            <TableContainer
              component={`div`}
              sx={{
                overflowX: `hidden`,
                overflowY: `auto`,
                position: `relative`
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>

                    <TableCell
                      sx={{
                        background: theme => theme.palette.neutral.main,
                        border: `none`,
                        px: 1.5,
                        py: 2.2
                      }}
                    >
                      <Stack
                        direction={`row`}
                        alignItems={`center`}
                      >
                        <Stack
                          direction={`column`}
                          alignItems={`center`}
                          justifyContent={`center`}
                        >

                          <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                            Activity Overview
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  <TableRow sx={{
                    display: 'flex', justifyContent: 'space-between', pt: 1.5, pb: 0.5,
                    px: 1.5,
                    background: theme => theme.palette.neutral.common
                  }} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" >Sales&nbsp;</Typography>
                      <Typography variant="subtitle2" >{numberToFix(statistic.sales * 100)}%</Typography>
                    </Box>
                    <Box maxWidth={`80%`} width={`${80 * statistic.sales}%`} height={20} sx={{
                      background: `#88C9A3`
                    }} />
                  </TableRow>

                  <TableRow sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    pt: 0.5,
                    pb: 0.5,
                    px: 1.5,
                    background: theme => theme.palette.neutral.common,
                  }} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" >Listings&nbsp;</Typography>
                      <Typography variant="subtitle2" >{numberToFix(statistic.listings * 100)}%</Typography>
                    </Box>
                    <Box maxWidth={`80%`} width={`${80 * statistic.listings}%`} height={20} sx={{
                      background: `#88C9A3`
                    }} />
                  </TableRow>

                  <TableRow sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    pt: 0.5,
                    pb: 1.5,
                    px: 1.5,
                    background: theme => theme.palette.neutral.common,
                  }} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" >Delistings&nbsp;</Typography>
                      <Typography variant="subtitle2" >{numberToFix(statistic.delistings * 100)}%</Typography>
                    </Box>
                    <Box maxWidth={`80%`} width={`${80 * statistic.delistings}%`} height={20} sx={{
                      background: `#88C9A3`
                    }} />
                  </TableRow>

                </TableBody>
              </Table >
            </TableContainer >
          </Box>

          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center'
              sx={{
                py: 1.5
              }}
            >
              <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Highest Sales</Typography>
              <Typography variant='subtitle2' sx={{ color: theme => theme.palette.common.white }}>last 1k transaction</Typography>
            </Stack>
            <TableContainer
              component={`div`}
              sx={{
                overflowX: `hidden`,
                overflowY: `auto`,
                position: `relative`,
                minHeight: `calc(50vh - 114px)`,
                maxHeight: `calc(50vh - 114px)`
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead
                >
                  <TableRow>
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.main }} />
                    <TableCell
                      sx={{
                        border: `none`,
                        py: 2.2,
                        px: 1,
                        background: theme => theme.palette.neutral.main,
                        display: {
                          ss: `none`,
                          sm: `table-cell`
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: `flex`,
                          alignItems: `center`,
                          justifyContent: `center`
                        }}
                      >

                      </Box>
                    </TableCell>
                    {
                      hightestSales?.map((item: any, index: any) => {
                        return (
                          <TableCell
                            sx={{
                              width: {
                                ss: index < 2 ? (index < 1 ? `25%` : `30%`) : `auto`,
                                sm: index < 2 ? (index < 1 ? `18%` : `23%`) : `auto`,
                              },
                              border: `none`,
                              py: 2.2,
                              px: 1,
                              background: theme => theme.palette.neutral.main,
                              display: {
                                ss: item.hiddenItem ? `none` : `table-cell`,
                                sm: `table-cell`
                              }
                            }}
                            key={index}
                          >
                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={index == 0 ? `flex-start` : `center`}
                            >
                              <Stack
                                direction={`column`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >

                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {item.title}
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>
                        )
                      })
                    }
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.main }} />
                  </TableRow>
                </TableHead>

                <TableBody>

                  {
                    !loadingHightest ? (
                      highestSalesData?.map((data: any, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                              }}
                            >
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                display: {
                                  ss: `none`,
                                  xs: `none`,
                                  sm: `table-cell`
                                }
                              }}
                            >
                              <Box
                                component={`img`}
                                src={data?.image}
                                sx={{
                                  width: `36px`,
                                  height: `36px`,
                                  borderRadius: `50%`
                                }}
                                onError={handleImageError}
                              >
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                display: {
                                  ss: `none`,
                                  sm: `table-cell`
                                }
                              }}
                            >
                              <Typography variant='subtitle2' >{data?.collection_name}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Typography variant='subtitle2' >{data?.name}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Stack
                                direction={`row`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >
                                <Typography variant='subtitle2' >{data?.price && `${numberToFix(data?.price / LAMPORTS_PER_SOL)}`}</Typography>

                                <Box
                                  component={`img`}
                                  src={`/images/icons/sol.svg`}
                                  sx={{
                                    ml: 1,
                                    width: `12px`,
                                    height: `12px`
                                  }}
                                  onError={handleImageError}
                                >
                                </Box>
                              </Stack>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                textAlign: `center`,
                              }}
                            >
                              <Typography variant='subtitle2' sx={{ cursor: 'pointer' }} >
                                <Link href={`${getMarketplace(data?.marketplace)}${data?.mint}`} passHref>
                                  <a target="_blank">
                                    <Box
                                      sx={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: `center`
                                      }}
                                    >
                                      <Box
                                        component={`img`}
                                        src={`${getMarketplaceImage(data?.marketplace)}`}
                                        sx={{
                                          width: `36px`,
                                          height: `36px`,
                                          borderRadius: `50%`
                                        }}
                                        onError={handleImageError}
                                      >
                                      </Box>
                                    </Box>
                                  </a>
                                </Link>
                              </Typography>
                            </TableCell>
                            <TableCell sx={{
                              border: `none`,
                              background: theme => theme.palette.neutral.common,
                              py: 1,
                              px: 1,
                            }} />
                          </TableRow>
                        )
                      })
                    ) :
                      (
                        new Array(10).fill(undefined).map((data: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                }} />
                              <TableCell
                                align="center"
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  display: {
                                    ss: `none`,
                                    sm: `table-cell`
                                  }
                                }}
                              >
                                <Skeleton variant="circular" width={36} height={36} />
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  display: {
                                    ss: `none`,
                                    sm: `table-cell`
                                  }
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`,
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ cursor: 'pointer', width: `100%` }} >
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                }}
                              />
                            </TableRow>
                          )
                        })
                      )
                  }
                </TableBody>
              </Table >
            </TableContainer >
          </Box>

          <Box
            sx={{
              mx: `auto`,
              background: `none`,
              position: `relative`,
              width: `100%`
            }}
          >
            <Stack direction='row' justifyContent="space-between" alignItems='center' sx={{
              py: 1.5
            }}>
              <Typography variant='h6' sx={{ color: theme => theme.palette.common.white }}>Lowest Listings</Typography>
              <Typography variant='subtitle2' sx={{ color: theme => theme.palette.common.white }}>based off last 1k transactions</Typography>
            </Stack>
            <TableContainer
              component={`div`}
              sx={{
                overflowX: `hidden`,
                overflowY: `auto`,
                position: `relative`,
                minHeight: `calc(50vh - 115px)`,
                maxHeight: `calc(50vh - 115px)`
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead
                >
                  <TableRow>
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.main }} />
                    <TableCell
                      sx={{
                        border: `none`,
                        py: 2.2,
                        px: 1,
                        background: theme => theme.palette.neutral.main,
                        display: {
                          ss: `none`,
                          sm: `table-cell`
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: `flex`,
                          alignItems: `center`,
                          justifyContent: `center`
                        }}
                      >

                      </Box>
                    </TableCell>
                    {
                      lowestListings?.map((item: any, index: any) => {
                        return (
                          <TableCell
                            sx={{
                              width: {
                                ss: index < 2 ? (index < 1 ? `25%` : `30%`) : `auto`,
                                sm: index < 2 ? (index < 1 ? `18%` : `23%`) : `auto`,
                              },
                              display: {
                                ss: item.hiddenItem ? `none` : `table-cell`,
                                sm: `table-cell`
                              },
                              border: `none`,
                              py: 2.2,
                              px: 1,
                              background: theme => theme.palette.neutral.main
                            }}
                            key={index}
                          >
                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={index == 0 ? `flex-start` : `center`}
                            >
                              <Stack
                                direction={`column`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >

                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {item.title}
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCell>
                        )
                      })
                    }
                    <TableCell sx={{ border: `none`, width: `3%`, background: theme => theme.palette.neutral.main }} />
                  </TableRow>
                </TableHead>

                <TableBody>

                  {
                    !loadingLowest ? (
                      lowestListingsData?.map((data: any, index: number) => {
                        return (
                          <TableRow key={index}>
                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                              }}
                            >
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                display: {
                                  ss: `none`,
                                  sm: `table-cell`
                                },
                              }}
                            >
                              <Box
                                component={`img`}
                                src={data?.image}
                                sx={{
                                  width: `36px`,
                                  height: `36px`,
                                  borderRadius: `50%`
                                }}
                                onError={handleImageError}
                              >
                              </Box>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                display: {
                                  ss: `none`,
                                  sm: `table-cell`
                                },
                              }}
                            >
                              <Typography variant='subtitle2' >{data?.collection_name}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Typography variant='subtitle2' >{data?.name}</Typography>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                textAlign: `center`
                              }}
                            >
                              <Stack
                                direction={`row`}
                                alignItems={`center`}
                                justifyContent={`center`}
                              >
                                <Typography variant='subtitle2' >{data?.price && `${numberToFix(data?.price / LAMPORTS_PER_SOL)}`}</Typography>

                                <Box
                                  component={`img`}
                                  src={`/images/icons/sol.svg`}
                                  sx={{
                                    ml: 1,
                                    width: `12px`,
                                    height: `12px`
                                  }}
                                  onError={handleImageError}
                                >
                                </Box>
                              </Stack>

                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                                textAlign: `center`,
                              }}
                            >
                              <Typography variant='subtitle2' sx={{ cursor: 'pointer' }} >
                                <Link href={`${getMarketplace(data?.marketplace)}${data?.mint}`} passHref>
                                  <a target="_blank">
                                    <Box
                                      sx={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: `center`
                                      }}
                                    >
                                      <Box
                                        component={`img`}
                                        src={`${getMarketplaceImage(data?.marketplace)}`}
                                        sx={{
                                          width: `36px`,
                                          height: `36px`,
                                          borderRadius: `50%`
                                        }}
                                        onError={handleImageError}
                                      >
                                      </Box>
                                    </Box>
                                  </a>
                                </Link>
                              </Typography>
                            </TableCell>
                            <TableCell sx={{
                              border: `none`,
                              background: theme => theme.palette.neutral.common,
                              py: 1,
                              px: 1,
                            }} />
                          </TableRow>
                        )
                      })
                    ) :
                      (
                        new Array(10).fill(undefined).map((data: any, index: number) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                }} />
                              <TableCell
                                align="center"
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  display: {
                                    ss: `none`,
                                    sm: `table-cell`
                                  },
                                }}
                              >
                                <Skeleton variant="circular" width={36} height={36} />
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  display: {
                                    ss: `none`,
                                    sm: `table-cell`
                                  },
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ width: `100%` }}>
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                  textAlign: `center`,
                                }}
                              >
                                <Typography variant='subtitle2' sx={{ cursor: 'pointer', width: `100%` }} >
                                  <Skeleton animation="wave" sx={{ width: `100%` }} />
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: `none`,
                                  background: theme => theme.palette.neutral.common,
                                  py: 1,
                                  px: 1,
                                }}
                              />
                            </TableRow>
                          )
                        })
                      )
                  }
                </TableBody>
              </Table >
            </TableContainer >
          </Box>
        </Grid>
      </Grid >

      <Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
        <Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
          {messageContent}
        </Alert>
      </Snackbar>
    </>

  )
}

export default market;