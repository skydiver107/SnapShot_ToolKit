import React, { Fragment, useEffect, useRef, useState } from "react";

import Link from 'next/link';
import { useRouter } from 'next/router';
import { createTheme, responsiveFontSizes } from "@mui/material";
import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, Line, Scatter, Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Skeleton from '@mui/material/Skeleton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Toolbar from "@mui/material/Toolbar";
import Divider from '@mui/material/Divider';
import Avatar from "@mui/material/Avatar";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';

import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';

import DiscordButton from 'src/components/IconButton/DiscordButton';
import LanguageButton from '@components/IconButton/LanguageButton';
import ShopButton from 'src/components/IconButton/ShopButton';
import TwitterButton from 'src/components/IconButton/TwitterButton';
import PaperButton from 'src/components/PaperButton';

import PageInfo from "src/components/PageContainer/PageInfo";

import { numberToFix } from "src/common/utils/helpers";
import { handleImageError } from "src/common/utils/handleImageError";
import { DATA_API, TIME_RANGE, COLLECTION_ANALYSTIC_PERIOD, CORS_PROXY_SERVER, TIME_INCREASE } from "src/common/config";

import fetchData from "src/common/services/getDataWithAxios";
import getDatesInterval from "src/helper/getDateInterval";
import getTimeBefore from "src/helper/getTimeBefore";

import { getMarketplace, getMarketplaceImage } from "src/common/services/getMarketplace";

import { TableHead } from "@mui/material";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const lastSalesField = [
  {
    field: `name`,
  },
  {
    field: `price`,
  },
  {
    field: `link`
  },
];

const lowestListingField = [
  {
    field: `name`
  },
  {
    field: `price`
  },
  {
    field: `link`
  },
];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let globalPeriod = COLLECTION_ANALYSTIC_PERIOD.DAY;
const Nfts = () => {
  const router = useRouter();
  const theme = createTheme()
  const siteTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  //Symbol
  const [symbol, setSymbol] = useState<string | string[]>(``);
  const [username, setUsername] = useState<string>(`root`);

  // For Fetch Detail Data
  const [detailData, setDetailData] = useState<any>(null);

  //Switch charts
  const [graphmode, setGraphmode] = React.useState(true);
  const [showVolume, setShowVolume] = React.useState(true);
  const [showList, setShowList] = React.useState(true);

  const [chartData, setChartData] = useState<any[] | null>(null);
  const [chartDayData, setChartDayData] = useState<any[] | null>(null);
  const [chartWeekData, setChartWeekData] = useState<any[] | null>(null);
  const [chartMonthData, setChartMonthData] = useState<any[] | null>(null);
  const [chartAllData, setChartAllData] = useState<any[] | null>(null);
  const [loadChart, setLoadChart] = useState<boolean>(false);
  const [period, setPeriod] = useState<number>(COLLECTION_ANALYSTIC_PERIOD.DAY);

  const [entireData, setEntireData] = useState<any>(null);
  const [spreadData, setSpreadData] = useState<any[]>(null);
  const [lastSalesData, setLastSalesData] = useState<any[] | null>(null);

  const [timer, setTimer] = React.useState(null);

  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);
  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsShowMessage(false);
  };

  const startInterval = async () => {
    const intervalId = window.setInterval(async () => {
      setTimer(timer => timer + TIME_INCREASE);
    }, TIME_RANGE * 6)
    return intervalId;
  }

  //For fetch Data
  const getFetching = async () => {
    new Promise((myResolve, myReject) => {
      const details: any = fetchData({
        method: `post`,
        route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${username}${DATA_API.GET_COLLECTION_DETAIL.DETAIL}`,
        data: {
          symbol: symbol
        }
      });
      myResolve(details);
    }).then(async (res) => {
      const result: any = res;
      setDetailData({ ...result });
    });

    new Promise((myResolve, myReject) => {
      const last: any = fetchData({
        method: `get`,
        route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${username}${DATA_API.GET_COLLECTION_DETAIL.LAST}?symbol=${symbol}`,
      });
      myResolve(last);
    }).then((res) => {
      const result: any = res;
      if (result && Array.isArray(result)) {
        setLastSalesData([...result]);
      }
    });

    new Promise((myResolve, myReject) => {
      const lowest: any = fetchData({
        method: `get`,
        route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${username}${DATA_API.GET_COLLECTION_DETAIL.LOWEST}?symbol=${symbol}`,
      });
      myResolve(lowest);
    }).then((res) => {
      const result: any = res;
      if (result && Array.isArray(result)) {
        setEntireData({
          ...{
            lowestNfts: result || []
          }
        });
      }
    })
  }

  const getActsAndMetrics = async () => {
    try {
      new Promise((myResolve, myReject) => {
        const metrics: any = fetchData({
          method: `get`,
          route: `${CORS_PROXY_SERVER}/${DATA_API.GET_COLLECTION_DETAIL.SNIPER_METRICS_URL}?collection=${symbol}`,
        });
        myResolve(metrics);
      }).then((res) => {
        const result: any = res;
        if (result && result?.PRICE_DISTRIBUTION) {
          const tempData = result?.PRICE_DISTRIBUTION || [];
          const temp = tempData.map((data: any) => {
            return {
              spread: data?.max,
              count: data?.count
            }
          })
          setSpreadData([...temp])
        }
      });
    }
    catch (err) {

    }
  }

  const getChartData = async (mode: number) => {
    new Promise((myResolve, myReject) => {
      const charts: any = fetchData({
        method: `post`,
        route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${username}${DATA_API.GET_COLLECTION_DETAIL.CHART}`,
        data: {
          symbol: symbol,
          mode: mode
        }
      });
      myResolve(charts);
    }).then((res) => {
      const result: any = res;
      if (result && Array.isArray(result)) {
        if (globalPeriod == mode) {
          setChartData([...result]);
        }

        switch (mode) {
          case COLLECTION_ANALYSTIC_PERIOD.ALL:
            setChartAllData([...result])
            break;
          case COLLECTION_ANALYSTIC_PERIOD.DAY:
            setChartDayData([...result])
            break;
          case COLLECTION_ANALYSTIC_PERIOD.WEEK:
            setChartWeekData([...result])
            break;
          case COLLECTION_ANALYSTIC_PERIOD.MONTH:
            setChartMonthData([...result])
            break;

          default:
            break;
        }
      }
    })
  }

  const getAutoFetching = async () => {
    try {
      if (username && symbol) {
        getFetching();
        getChartData(COLLECTION_ANALYSTIC_PERIOD.MONTH);
        getChartData(COLLECTION_ANALYSTIC_PERIOD.WEEK);
        getChartData(COLLECTION_ANALYSTIC_PERIOD.DAY);
        getChartData(COLLECTION_ANALYSTIC_PERIOD.ALL);
        getActsAndMetrics();
      }
    }
    catch (err) {

    }
  }

  useEffect(() => {
    (async () => {
      globalPeriod = COLLECTION_ANALYSTIC_PERIOD.DAY;
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (router.isReady && router.query.collection && router.query.user) {
        setSymbol(router.query.collection);
        startInterval();
      }
    })()
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      if (router.isReady && symbol) {
        await getAutoFetching();
      }
    })()
  }, [router.isReady, symbol, timer]);

  useEffect(() => {
    (async () => {
      if (router.isReady && symbol) {
        globalPeriod = period;
        let result = null;
        switch (period) {
          case COLLECTION_ANALYSTIC_PERIOD.ALL:
            result = chartAllData;
            break;
          case COLLECTION_ANALYSTIC_PERIOD.DAY:
            result = chartDayData;
            break;
          case COLLECTION_ANALYSTIC_PERIOD.WEEK:
            result = chartWeekData;
            break;
          case COLLECTION_ANALYSTIC_PERIOD.MONTH:
            result = chartMonthData;
            break;

          default:
            break;
        }
        if (result && Array.isArray(result)) {
          setChartData([...result]);
        }
        else {
          new Promise((myResolve, myReject) => {
            const charts: any = fetchData({
              method: `post`,
              route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${username}${DATA_API.GET_COLLECTION_DETAIL.CHART}`,
              data: {
                symbol: symbol,
                mode: period
              }
            });
            myResolve(charts);
          }).then((res) => {
            const result: any = res;
            if (result && Array.isArray(result)) {
              if (globalPeriod == period) {
                setChartData([...result]);
              }

              switch (period) {
                case COLLECTION_ANALYSTIC_PERIOD.ALL:
                  setChartAllData([...result])
                  break;
                case COLLECTION_ANALYSTIC_PERIOD.DAY:
                  setChartDayData([...result])
                  break;
                case COLLECTION_ANALYSTIC_PERIOD.WEEK:
                  setChartWeekData([...result])
                  break;
                case COLLECTION_ANALYSTIC_PERIOD.MONTH:
                  setChartMonthData([...result])
                  break;

                default:
                  break;
              }
            }
          })
        }
      }
    })()
  }, [period]);

  return (
    <>
      <PageInfo></PageInfo>

      <Box
        sx={{
          mx: `auto`,
          position: `relative`,
          px: {
            md: 13,
            ss: 4,
            xs: 6,
            sm: 8
          },
          py: 4,
          pt: 0
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 2.5,
          }}
        >
          <Typography
            variant={'h6'}
            sx={{
              color: theme => theme.palette.common.white
            }}
          >
            Project Overview
          </Typography>
        </Stack>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          sx={{
            background: theme => theme.palette.neutral.main
          }}
        >
          <Grid
            item
            container
            ss={12}
            md={6}
            direction="row"
            alignItems="stretch"
            justifyContent="flex-start"
            sx={{
              p: 1
            }}
          >
            <Grid item ss={12} sm={5}>
              <Stack
                direction={`row`}
                alignItems={`center`}
                justifyContent={`flex-start`}
                sx={{
                  justifyContent: {
                    ss: `center`,
                    sm: `left`
                  }
                }}
              >
                {detailData?.symbol ?
                  <Box
                    component={`img`}
                    src={detailData?.image}
                    sx={{
                      width: 156,
                      height: 156,
                      borderRadius: `50%`,
                      objectFit: `cover`
                    }}
                    onError={handleImageError}
                  /> : <Skeleton variant="circular" width={156} height={156} />
                }
              </Stack>
            </Grid>

            <Grid item ss={12} sm={7}>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
                sx={{
                  py: 1.2,
                  alignItems: {
                    ss: `center`,
                    sm: `stretch`
                  }
                }}
              >
                <Box sx={{
                  textAlign: {
                    ss: `center`,
                    sm: `left`
                  }
                }}>
                  <Typography variant={'h6'} sx={{ pb: 1 }}>
                    {detailData?.symbol ? detailData?.name : <Skeleton animation="wave" sx={{ width: `25%` }} />}
                  </Typography>

                  {
                    detailData?.symbol ?
                      <Typography variant={`subtitle2`} sx={{ pb: 2, lineHeight: `1.2` }}>
                        {detailData?.description}
                      </Typography> :
                      <Box sx={{ width: `100%` }}>
                        <Typography variant={`subtitle2`} ><Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        <Typography variant={`subtitle2`} ><Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                        <Typography variant={`subtitle2`} ><Skeleton animation="wave" sx={{ width: `50%` }} /></Typography>
                      </Box>
                  }
                </Box>

                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={3}
                  sx={{
                    mt: {
                      ss: 2,
                      sm: 4
                    }
                  }}
                >
                  {
                    detailData?.symbol ?
                      detailData?.website ?
                        <Link href={detailData?.website || '/'}>
                          <a target="_blank">
                            <LanguageButton
                              sx={{
                                width: 24,
                                height: 24,
                                '&:hover': { cursor: `pointer` }
                              }}
                            />
                          </a>
                        </Link> :
                        <LanguageButton
                          sx={{
                            width: 24,
                            height: 24,
                            '&:hover': { cursor: `pointer` }
                          }}
                        /> :
                      <Skeleton variant="circular" width={24} height={24} />
                  }

                  {
                    detailData?.symbol ?
                      detailData?.twitter ?
                        <Link href={detailData?.twitter || '/'}>
                          <a target="_blank">
                            <TwitterButton
                              sx={{
                                width: 24,
                                height: 24,
                                '&:hover': { cursor: `pointer` }
                              }}
                            />
                          </a>
                        </Link> :
                        <TwitterButton
                          sx={{
                            width: 24,
                            height: 24,
                            '&:hover': { cursor: `pointer` }
                          }}
                        /> :
                      <Skeleton variant="circular" width={24} height={24} />
                  }

                  {
                    detailData?.symbol ?
                      detailData?.discord ?
                        <Link href={detailData?.discord || '/'}>
                          <a target="_blank">
                            <DiscordButton
                              sx={{
                                width: 24,
                                height: 24,
                                '&:hover': { cursor: `pointer` }
                              }}
                            />
                          </a>
                        </Link> :
                        <DiscordButton
                          sx={{
                            width: 24,
                            height: 24,
                            '&:hover': { cursor: `pointer` }
                          }}
                        /> :
                      <Skeleton variant="circular" width={24} height={24} />
                  }
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Grid
            container
            item
            ss={12}
            md={6}
            direction={`row`}
            alignItems={`stretch`}
            justifyContent={`space-between`}
            sx={{
              background: theme => theme.palette.neutral.main
            }}
          >

            <Grid
              item
              ss={4}
              sm={2}
              sx={{
                background: theme => theme.palette.neutral.main,
                textAlign: `center`,
                py: 2.2,
                borderLeft: {
                  md: theme => `solid 2px ${theme.palette.neutral.paper}`,
                },
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Supply
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    &nbsp;
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.symbol ?
                        detailData?.supply > 1000 ? `${(detailData?.supply / 1000).toFixed(1)}k` : detailData?.supply
                        :
                        <Skeleton animation="wave" />
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              ss={4}
              sm={2}
              sx={{
                background: theme => theme.palette.neutral.main,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.paper}`,
                px: 2,
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Listings
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    &nbsp;
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.symbol ?
                        detailData?.listed > 1000 ? `${(detailData?.listed / 1000).toFixed(1)}k` : detailData?.listed
                        :
                        <Skeleton animation="wave" />
                    }
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: 2 }}
                    >
                      {
                        (!detailData?.symbol && !detailData?.listRatio) ? <Skeleton animation="wave" sx={{ width: `25%` }} /> : ``
                      }

                      {
                        detailData?.listRatio ? numberToFix(detailData?.listRatio * 100) : (detailData?.symbol ? 0 : ``)
                      }

                      {
                        detailData?.listRatio ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              ss={4}
              sm={2}
              sx={{
                background: theme => theme.palette.neutral.main,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.paper}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Floor
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    &nbsp;
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.floor && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.floor && <Skeleton animation="wave" />
                    }
                    {

                      detailData?.floor && numberToFix(detailData?.floor / LAMPORTS_PER_SOL)
                    }
                    {
                      detailData?.floor == 0 && 0
                    }
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={0.5}
                      sx={{ mt: 2 }}
                    >
                      {
                        (!detailData?.symbol && !detailData?.floorChange) ? <Skeleton animation="wave" sx={{ width: `25%` }} /> : ``
                      }
                      {
                        (detailData?.floorChange && detailData?.floorChange > 0) ? <GreenUp sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        (detailData?.floorChange && detailData?.floorChange < 0) ? <RedDown sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        detailData?.floorChange ? numberToFix(detailData?.floorChange * 100) : (detailData?.symbol ? 0 : ``)
                      }

                      {
                        detailData?.floorChange ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              ss={4}
              sm={2}
              sx={{
                background: theme => theme.palette.neutral.main,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => {
                  return {
                    sm: `solid 2px ${theme.palette.neutral.paper}`
                  }
                },
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Volume
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    all time
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.volume && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.volume && <Skeleton animation="wave" />
                    }
                    {
                      detailData?.volume &&
                      ((detailData?.volume / LAMPORTS_PER_SOL) > 1000 ? `${(detailData?.volume / LAMPORTS_PER_SOL / 1000).toFixed(1)} k`
                        : `${numberToFix(detailData?.volume / LAMPORTS_PER_SOL)}`)
                    }
                    {
                      detailData?.volume == 0 && 0
                    }


                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >

                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              ss={4}
              sm={2}
              sx={{
                background: theme => theme.palette.neutral.main,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.paper}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Volume
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    {/* all time */}
                    7 days
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.volume7d && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.volume7d && <Skeleton animation="wave" />
                    }
                    {
                      detailData?.volume7d &&
                      ((detailData?.volume7d / LAMPORTS_PER_SOL) > 1000 ? `${((detailData?.volume7d / LAMPORTS_PER_SOL) / 1000).toFixed(1)} k`
                        : `${numberToFix(detailData?.volume7d / LAMPORTS_PER_SOL)}`)
                    }
                    {
                      detailData?.volume7d == 0 && 0
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              ss={4}
              sm={2}
              sx={{
                background: theme => theme.palette.neutral.main,
                textAlign: `center`,
                py: 2.2,
                borderLeft: theme => `solid 2px ${theme.palette.neutral.paper}`,
                px: 2
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    pb: 2
                  }}
                >
                  <Typography
                    variant={'h6'}
                  >
                    Volume
                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                    sx={{ mt: 2 }}
                  >
                    24 hour
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={6}
                >
                  <Typography
                    variant={'h6'}
                    sx={{ mt: 2 }}
                  >
                    {
                      detailData?.volume24hr && `•`
                    }
                    {
                      !detailData?.symbol && !detailData?.volume24hr && <Skeleton animation="wave" />
                    }
                    {
                      detailData?.volume24hr &&
                      ((detailData?.volume24hr / LAMPORTS_PER_SOL) > 1000 ? `${((detailData?.volume24hr / LAMPORTS_PER_SOL) / 1000).toFixed(1)} k`
                        : `${numberToFix(detailData?.volume24hr / LAMPORTS_PER_SOL)}`)
                    }
                    {
                      detailData?.volume24hr == 0 && 0
                    }

                  </Typography>

                  <Typography
                    variant={`subtitle2`}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ mt: 2 }}
                    >
                      {
                        !detailData?.symbol && !detailData?.volume24hrChange && <Skeleton animation="wave" sx={{ width: `25%` }} />
                      }

                      {
                        (detailData?.volume24hrChange && detailData?.volume24hrChange > 0) ? <GreenUp sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        (detailData?.volume24hrChange && detailData?.volume24hrChange < 0) ? <RedDown sx={{ width: '11px', height: '11px', mr: 0.5 }} /> : ``
                      }

                      {
                        detailData?.volume24hrChange ? numberToFix(detailData?.volume24hrChange * 100) : (detailData?.symbol ? 0 : ``)
                      }

                      {
                        detailData?.volume24hrChange ? `%` : ``
                      }
                    </Stack>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 0.75,
            mt: 1
          }}
        >
          <Typography
            variant={'h6'}
            sx={{ color: theme => theme.palette.common.white }}
          >
            Visual Data
          </Typography>

          <ButtonGroup variant="contained" aria-label="outlined primary button group"
            sx={{
              boxShadow: `none`,
              '& .MuiButtonGroup-grouped': {
                borderRight: `none !important`,
              }
            }}
          >
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.ALL} sx={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.ALL);
                }
              }
            >
              <Typography
                variant={`subtitle2`}
              >
                all time
              </Typography>
            </PaperButton>
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.MONTH}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.MONTH)
                }
              }
            >
              <Typography
                variant={`subtitle2`}

              >
                30 days
              </Typography>
            </PaperButton>
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.WEEK}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.WEEK);
                }
              }
            >
              <Typography
                variant={`subtitle2`}
              >
                7 days
              </Typography>
            </PaperButton>
            <PaperButton size={`medium`} selected={period == COLLECTION_ANALYSTIC_PERIOD.DAY}
              onClick={
                async () => {
                  setPeriod(COLLECTION_ANALYSTIC_PERIOD.DAY);
                }
              }
              sx={{
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4
              }}
            >
              <Typography
                variant={`subtitle2`}
              >
                24 hours
              </Typography>
            </PaperButton>
          </ButtonGroup>
        </Stack>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={0}
          sx={{ mt: 1, py: `0 !important` }}
        >
          <Grid item ss={12} md={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
              sx={{
                background: theme => theme.palette.neutral.main,
                px: 2,
                py: 0.25
              }}
            >
              <Typography variant={'subtitle2'} sx={{ color: theme => theme.palette.common.white }}>
                Floor Price
              </Typography>

              <ButtonGroup variant="contained" aria-label="outlined primary button group"
                sx={{
                  '& .MuiButtonGroup-grouped': {
                    borderRight: `none !important`,
                  },
                }}
              >
                <PaperButton size={`medium`} selected={graphmode}
                  sx={{
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                  }}
                  onClick={() => {
                    setGraphmode(true);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    graph
                  </Typography>
                </PaperButton>
                <PaperButton size={`medium`}
                  selected={!graphmode}
                  sx={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                  onClick={() => {
                    setGraphmode(false);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    points
                  </Typography>
                </PaperButton>
              </ButtonGroup>
            </Stack>
          </Grid>

          <Grid item ss={0} md={6} sx={{ py: `0 !important`, display: { ss: `none`, md: `block` } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
              sx={{ pl: 2, py: 0.25, background: theme => theme.palette.neutral.main, px: 2 }}
            >
              <Typography variant={'subtitle2'} sx={{ color: theme => theme.palette.common.white }}>
                Volume and Listings
              </Typography>

              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                sx={{
                  '& .MuiButtonGroup-grouped': {
                    borderRight: `none !important`,
                  },
                }}
              >
                <PaperButton size={`medium`}
                  selected={showVolume}
                  sx={{
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                  }}
                  onClick={() => {
                    setShowVolume(!showVolume);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    volume
                  </Typography>
                </PaperButton>
                <PaperButton size={`medium`} selected={showList}
                  sx={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                  onClick={() => {
                    setShowList(!showList);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    listings
                  </Typography>
                </PaperButton>
              </ButtonGroup>
            </Stack>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          sx={{
            mt: 0, py: `0 !important`,
            background: theme => theme.palette.neutral.main,
          }}
        >
          <Grid item ss={12} md={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              sx={{
                py: 1.5,
                px: 2,
              }}
            >
              {
                (chartData && !loadChart) ? (
                  graphmode ?
                    <Chart
                      type={
                        'bar'
                      }
                      options={{
                        responsive: true,
                      }}
                      data={{
                        labels: chartData?.map((chart: any, index: number) => {
                          if (period == COLLECTION_ANALYSTIC_PERIOD.DAY) {
                            // return `${new Date(chart?.openTimestamp).getHours()}:${new Date(chart?.openTimestamp).getMinutes()}`
                            return `${new Date(chart?.openTimestamp).getHours()}:00`
                          }
                          return `${monthNames[new Date(chart?.openTimestamp).getMonth()]} ${new Date(chart?.openTimestamp).getDate()}`
                        }),
                        datasets: [
                          {
                            type: 'line' as const,
                            label: 'Floor',
                            borderColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#9AC3E2`,
                            borderWidth: 2,
                            fill: false,
                            data: chartData?.map((chart: any, index: number) => {
                              return numberToFix((chart?.floor || 0));
                            })
                          }
                        ],
                      }} /> :
                    <Line
                      options={{
                        responsive: true,
                        interaction: {
                          mode: 'index' as const,
                          intersect: false,
                        },
                        stacked: true,
                        plugins: {
                          title: {
                            display: false,
                            text: 'Chart.js Line Chart - Multi Axis',
                          },
                        },

                        scales: {
                          y: {
                            type: 'linear' as const,
                            display: true,
                            position: 'left' as const,
                          }
                        },
                      }}
                      data={{
                        labels: chartData?.map((chart: any, index: number) => {
                          if (period == COLLECTION_ANALYSTIC_PERIOD.DAY) {
                            return `${new Date(chart?.openTimestamp).getHours()}:00`
                          }
                          return `${monthNames[new Date(chart?.openTimestamp).getMonth()]} ${new Date(chart?.openTimestamp).getDate()}`
                        }),
                        datasets: [
                          {
                            label: 'Floor',
                            data: chartData?.map((chart: any, index: number) => {
                              return numberToFix((chart?.floor || 0));
                            }),
                            borderColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#9AC3E2`,
                            backgroundColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF50` : `#9AC3E250`,
                            yAxisID: 'y',
                            showLine: false
                          }
                        ],

                      }}
                    />
                ) :
                  <Skeleton animation="wave" width={`100%`} height={`360px`} />
              }

            </Stack>
          </Grid>

          <Grid item ss={12} md={0} sx={{ py: `0 !important`, display: { md: `none` } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={0}
              sx={{ pl: 2, py: 0.25, background: theme => theme.palette.neutral.main, px: 2 }}
            >
              <Typography variant={'subtitle2'} sx={{ color: theme => theme.palette.common.white }}>
                Volume and Listings
              </Typography>

              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                sx={{
                  '& .MuiButtonGroup-grouped': {
                    borderRight: `none !important`,
                  },
                }}
              >
                <PaperButton size={`medium`}
                  selected={showVolume}
                  sx={{
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4
                  }}
                  onClick={() => {
                    setShowVolume(!showVolume);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    volume
                  </Typography>
                </PaperButton>
                <PaperButton size={`medium`} selected={showList}
                  sx={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4
                  }}
                  onClick={() => {
                    setShowList(!showList);
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                  >
                    listings
                  </Typography>
                </PaperButton>
              </ButtonGroup>
            </Stack>
          </Grid>

          <Grid item ss={12} md={6} sx={{ py: `0 !important` }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              sx={{
                px: 2,
                py: 1.5,
              }}
            >
              {
                (chartData && !loadChart) ?
                  <Line
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index' as const,
                        intersect: false,
                      },
                      stacked: false,
                      plugins: {
                        title: {
                          display: false,
                          text: '',
                        },
                      },

                      scales: {
                        y: {
                          type: 'linear' as const,
                          display: showVolume,
                          position: 'left' as const,
                        },
                        y1: {
                          type: 'linear' as const,
                          display: showList,
                          position: 'right' as const,
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                    }}
                    data={{
                      labels: chartData?.map((chart: any, index: number) => {
                        if (period == COLLECTION_ANALYSTIC_PERIOD.DAY) {
                          return `${new Date(chart?.openTimestamp).getHours()}:00`
                        }
                        return `${monthNames[new Date(chart?.openTimestamp).getMonth()]} ${new Date(chart?.openTimestamp).getDate()}`
                      }),
                      datasets: [
                        {
                          label: 'Volume',
                          data: showVolume ? chartData?.map((chart: any, index: number) => {
                            return numberToFix((chart?.volume || 0));
                          }) : [],
                          borderColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#9AC3E2`,
                          backgroundColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF50` : `#9AC3E250`,
                          yAxisID: 'y',
                        },
                        {
                          label: 'Listings',
                          data: showList ? chartData?.map((chart: any, index: number) => {
                            return chart?.listing || 0
                          }) : [],
                          borderColor: 'rgb(246, 151, 153)',
                          backgroundColor: 'rgba(246, 151, 153, 0.5)',
                          yAxisID: 'y1',
                        },
                      ],

                    }}
                  /> :
                  <Skeleton animation="wave" width={`100%`} height={`360px`} />
              }
            </Stack>
          </Grid>

        </Grid>


        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
          sx={{
            mt: 1,
            py: 3,
          }}
        >

          <Grid item ss={12} md={4} sx={{ py: `0 !important` }}>
            <Typography variant={'h6'} sx={{ color: theme => theme.palette.common.white, py: 3 }}>
              Pricing Spread
            </Typography>
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`flex-start`}
              sx={{
                overflow: `auto`,
                maxHeight: {
                  md: `40vh`
                },
                minHeight: {
                  md: `40vh`
                },
              }}
            >
              <TableContainer
                component={`div`}
              >
                <Table
                  aria-label="simple table"
                  sx={{
                    tableLayout: `fixed`,
                    width: `100%`,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          pl: 4,
                          background: theme => `${theme.palette.neutral.main}`,
                          borderTopLeftRadius: 4
                        }}
                      >
                        <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                          Solana | Count
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                          borderTopRightRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                  </TableBody>
                </Table>
              </TableContainer>

              <Stack
                direction={`row`}
                alignItems={`center`}
                justifyContent={`center`}
                sx={{
                  px: 2,
                  height: `calc(40vh - 8px - 8px - 24px)`,
                  background: theme => theme.palette.neutral.common
                }}
              >
                {
                  spreadData ?
                    <Bar
                      options={{
                        plugins: {
                          title: {
                            display: false,
                            text: 'Chart.js Bar Chart - Stacked',
                          },
                        },
                        responsive: true,
                        stacked: false,
                        scales: {
                          x: {
                            stacked: false,
                          },
                          y: {
                            stacked: false,
                          },
                        },
                      }}
                      data={{
                        labels: spreadData.map((val: any, index: number) => { return (val?.spread || 0) }) || [],
                        datasets: [
                          {
                            label: 'Count',
                            data: spreadData.map((val: any, index: number) => { return (val?.count || 0) }) || [],
                            backgroundColor: (siteTheme != `` && siteTheme == `dark`) ? `#FFFFFF` : `#73ADD7`,
                          }
                        ],
                      }}
                    /> :
                    <Skeleton animation="wave" width={`100%`} height={`30vh`} />
                }
              </Stack>
            </Stack>
          </Grid>

          <Grid item ss={12} md={4} sx={{ py: `0 !important` }}>
            <Typography variant={'h6'} sx={{ color: theme => theme.palette.common.white, py: 3 }}>
              Last Sales
            </Typography>
            <Box>
              <TableContainer
                component={`div`}
                sx={{
                  overflowX: `hidden`,
                  overflowY: `auto`,
                  maxHeight: {
                    ss: `40vh`
                  }
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    tableLayout: `fixed`,
                    width: `100%`,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                          borderTopLeftRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: `flex`,
                            alignItems: `center`,
                            justifyContent: `center`
                          }}
                        >
                          <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                            nft
                          </Typography>
                        </Box>
                      </TableCell>
                      {
                        lastSalesField.map((menu: any, index: number) => {
                          return (
                            <TableCell
                              sx={{
                                border: `none`,
                                p: 1,
                                background: theme => `${theme.palette.neutral.main}`,
                              }}
                              key={index}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {menu.field}
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                        })
                      }
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                          borderTopRightRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      overflow: `hidden`
                    }}
                  >
                    {lastSalesData?.map((track: any, index: number) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell
                          sx={{
                            border: `none`,
                            py: 1,
                            px: 1,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          &nbsp;
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            py: 1,
                            px: 1,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Avatar src={track?.image} />
                          </Box>

                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {track?.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {numberToFix(track?.price / LAMPORTS_PER_SOL)}
                            </Typography>
                            <Box
                              component={`img`}
                              src={`/images/icons/sol.svg`}
                              sx={{
                                ml: 1,
                                width: `12px`,
                                height: `12px`
                              }}
                              onError={handleImageError}
                            ></Box>
                          </Box>
                        </TableCell>

                        {/* <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {
                                `${new Date(parseInt(track?.time)).getMonth() + 1} / ${new Date(parseInt(track?.time)).getDate()}`
                              }
                            </Typography>
                          </Box>
                        </TableCell> */}

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Link href={`${getMarketplace(track?.marketplace)}${track?.mint}`} passHref>
                              <a target="_blank">
                                <Box
                                  sx={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    justifyContent: `center`
                                  }}
                                >
                                  <Avatar src={`${getMarketplaceImage(track?.marketplace)}`} />
                                </Box>
                              </a>
                            </Link>

                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          &nbsp;
                        </TableCell>
                      </TableRow>
                    ))}

                    {
                      (!lastSalesData) &&
                      new Array(5).fill(undefined).map((val, index) => {
                        return (
                          <TableRow
                            key={index}
                          >
                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              &nbsp;
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Skeleton variant="circular" width={36} height={36} />
                              </Box>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            {/* <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell> */}

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              sx={{
                                border: `none`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              &nbsp;
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }

                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          <Grid item ss={12} md={4} sx={{ py: `0 !important` }}>
            <Typography variant={'h6'} sx={{ color: theme => theme.palette.common.white, py: 3 }}>
              Lowest Listings
            </Typography>
            <Box>
              <TableContainer
                component={`div`}
                sx={{
                  overflowX: `hidden`,
                  overflowY: `auto`,
                  maxHeight: {
                    ss: `40vh`
                  }
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    tableLayout: `fixed`,
                    width: `100%`,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                          borderTopLeftRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                      <TableCell
                        sx={{
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: `flex`,
                            alignItems: `center`,
                            justifyContent: `center`
                          }}
                        >
                          <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                            nft
                          </Typography>
                        </Box>
                      </TableCell>
                      {
                        lowestListingField.map((menu: any, index: number) => {
                          return (
                            <TableCell
                              sx={{
                                border: `none`,
                                p: 1,
                                background: theme => `${theme.palette.neutral.main}`,
                              }}
                              key={index}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.common.white }}>
                                  {menu.field}
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                        })
                      }
                      <TableCell
                        sx={{
                          width: `5%`,
                          border: `none`,
                          p: 1,
                          background: theme => `${theme.palette.neutral.main}`,
                          borderTopRightRadius: 4
                        }}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      overflow: `hidden`
                    }}
                  >
                    {entireData?.lowestNfts?.map((track: any, index: number) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >&nbsp;</TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Avatar src={track?.image} />
                          </Box>

                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {
                                track?.name
                              }
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Typography variant={`subtitle2`}>
                              {numberToFix(track?.price / LAMPORTS_PER_SOL)}
                            </Typography>
                            <Box
                              component={`img`}
                              src={`/images/icons/sol.svg`}
                              sx={{
                                ml: 1,
                                width: `12px`,
                                height: `12px`
                              }}
                              onError={handleImageError}
                            ></Box>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: `flex`,
                              alignItems: `center`,
                              justifyContent: `center`
                            }}
                          >
                            <Link href={`${getMarketplace(track?.marketplace)}${track?.mint}`} passHref>
                              <a target="_blank">
                                <Box
                                  sx={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    justifyContent: `center`
                                  }}
                                >
                                  <Avatar src={`${getMarketplaceImage(track?.marketplace)}`} />
                                </Box>
                              </a>
                            </Link>
                          </Box>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            border: `none`,
                            background: theme => theme.palette.neutral.common,
                            py: 1,
                            px: 1,
                          }}
                        >&nbsp;</TableCell>
                      </TableRow>
                    ))}

                    {
                      (entireData?.lowestNfts == undefined || entireData?.lowestNfts == null) &&
                      new Array(5).fill(undefined).map((val: undefined, index: number) => {
                        return (
                          <TableRow
                            key={index}
                          >
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >&nbsp;</TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Skeleton variant="circular" width={36} height={36} />
                              </Box>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: `flex`,
                                  alignItems: `center`,
                                  justifyContent: `center`
                                }}
                              >
                                <Typography variant={`subtitle2`}>
                                  <Skeleton animation="wave" sx={{ width: `32px` }} />
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{
                                border: `none`,
                                background: theme => theme.palette.neutral.common,
                                py: 1,
                                px: 1,
                              }}
                            >&nbsp;</TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

        </Grid>

        <Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
          <Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
            {messageContent}
          </Alert>
        </Snackbar>
      </Box>
    </>

  );
}

export default Nfts;
