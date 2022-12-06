import React, { Fragment, useEffect, useRef, useState } from "react";

import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react'

import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import moment from 'moment-timezone';

import * as anchor from '@project-serum/anchor';
import {
  LAMPORTS_PER_SOL,
  Commitment,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css'); // Default styles that can be overridden by your app


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

import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';
import ProfileIcon from '@components/IconButton/ProfileIcon';
import PageInfo from "src/components/PageContainer/PageInfo";
import PaperButton from "@components/PaperButton";
import { Avatar, Stack, TableHead } from "@mui/material";
import fetchData from "src/common/services/getDataWithAxios";

import { numberToFix } from "src/common/utils/helpers";
import { handleImageError } from "src/common/utils/handleImageError";
import { DATA_API, TIME_RANGE, LIMIT_COLUMNS, TIME_INCREASE, HYPERSPACE_UPCOMING_URL } from "src/common/config";


const topMoversField = [
  {
    title: 'project',
    field: `name`,
    statistic: false,
    lamports: false,
  },
  {
    title: '24h avg',
    field: `avgSale`,
    statistic: false,
    lamports: true,
  },
  {
    title: '% change',
    field: `avgSaleChange`,
    statistic: true,
    lamports: false,
  },
];

const newCollectionField = [
  {
    title: 'project',
    field: `name`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'date',
    field: `registed`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'time',
    field: `registed`,
    statistic: false,
    lamports: false,
  },
];

const newTokenField = [
  {
    title: 'project',
    field: `name`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'date',
    field: `registed`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'time',
    field: `registed`,
    statistic: false,
    lamports: false,
  },
];

const upcomingField = [
  {
    title: 'project',
    field: `display_name`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'launch',
    field: `launch_date`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'supply',
    field: `supply`,
    statistic: false,
    lamports: false,
  },
  {
    title: 'price',
    field: `price`,
    statistic: false,
    lamports: false,
  },
];

enum FunctionMode {
  TopCollection = `trends`,
  TopMovers = `movers`,
  Upcoming = `upcoming`,
  NewCollections = `collections`,
  NewTokens = `tokens`,
  LiveMints = `lives`,
}

const Home = () => {
  const router = useRouter();

  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const [topCollections, setTopCollections] = useState<any[] | null>(undefined);
  const [liveMints, setLiveMints] = useState<any[] | null>(undefined);
  const [topMovers, setTopMovers] = useState<any[] | null>(undefined);
  const [newCollections, setNewCollections] = useState<any[] | null>(undefined);
  const [newTokens, setNewTokens] = useState<any[] | null>(undefined);
  const [upcomings, setUpcomings] = useState<any[] | null>(undefined);

  const [timer, setTimer] = React.useState(null);

  const startInterval = async () => {
    const intervalId = window.setInterval(async () => {
      setTimer(timer => timer + TIME_INCREASE);
    }, TIME_RANGE * 6 * 60)
    return intervalId;
  }

  const getData = async (apiEndpoint: string, mode: FunctionMode) => {
    new Promise((myResolve, myReject) => {
      const fetchedData: any = fetchData({
        method: `get`,
        route: apiEndpoint
      });
      myResolve(fetchedData);
    }).then(async (res) => {
      const result: any = res;
      if (result && Array.isArray(result)) {

        switch (mode) {
          case FunctionMode.TopCollection:
            setTopCollections([...result]);
            break;

          case FunctionMode.TopMovers:
            setTopMovers([...result]);
            break;

          case FunctionMode.NewCollections:
            setNewCollections([...result]);
            break;

          case FunctionMode.NewTokens:
            setNewTokens([...result]);
            break;

          case FunctionMode.Upcoming:
            setUpcomings([...result]);
            break;

          case FunctionMode.LiveMints:
            setLiveMints([...result]);
            break;

          default:
            break;
        }
      }
      else {
        switch (mode) {
          case FunctionMode.TopCollection:
            if (result == null && topCollections == undefined) {
              setTopCollections([]);
            }
            break;
          case FunctionMode.TopMovers:
            if (result == null && topMovers == undefined) {
              setTopMovers([]);
            }
            break;
          case FunctionMode.NewCollections:
            if (result == null && newCollections == undefined) {
              setNewCollections([]);
            }
            break;
          case FunctionMode.NewTokens:
            if (result == null && newTokens == undefined) {
              setNewTokens([]);
            }
            break;
          case FunctionMode.Upcoming:
            if (result == null && upcomings == undefined) {
              setUpcomings([]);
            }
            else {
              const upcomingsData = result?.getUpcomingProjectsRaw?.upcoming_projects;
              if (upcomingsData && Array.isArray(upcomingsData)) {
                setUpcomings([...upcomingsData]);
              }
            }
            break;

          default:
            break;
        }

      }
    });
  }

  useEffect(() => {
    (async () => {
      if (router.isReady) {
        startInterval();
      }
    })()
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      if (router.isReady) {
        getData(`${DATA_API.GET_TOP_TRENDS}`, FunctionMode.TopCollection);
        getData(`${DATA_API.GET_COLLECTION_DETAIL.COMMON}${DATA_API.GET_COLLECTION_DETAIL.MOVER}`, FunctionMode.TopMovers);
        getData(`${DATA_API.GET_COLLECTION_DETAIL.COMMON}${DATA_API.GET_COLLECTION_DETAIL.COLLECTIONS}`, FunctionMode.NewCollections);
        // getData(`${DATA_API.GET_COLLECTION_DETAIL.COMMON}${DATA_API.GET_COLLECTION_DETAIL.UPCOMING}`, FunctionMode.Upcoming);
        getData(`${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.GET_LAUNCHPAD}?mode=future`, FunctionMode.Upcoming);
        getData(`${DATA_API.TOKEN_API.COMMON}${DATA_API.TOKEN_API.GET_NEW_TOKENS}`, FunctionMode.NewTokens);
        getData(`${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.GET_LAUNCHPAD}?mode=past`, FunctionMode.LiveMints);
      }
    })()
  }, [router.isReady, timer]);

  return (
    <Box
      component={`main`}
      sx={{ overflow: 'hidden' }}
    >
      <PageInfo >

      </PageInfo>

      {
        anchorWallet ?
          <>
            <Box component={`section`} sx={{
              px: {
                md: 13,
                ss: 2,
                xs: 6,
                sm: 8
              },
              py: 4
            }}>
              <Typography variant='h6' >Live Mint</Typography>
              <Grid container spacing={1.5}
                sx={{
                  my: 2,
                  minWidth: `100%`,
                  maxWidth: `100%`,
                  // maxWidth: '82%',
                  overflowX: 'auto',
                  overflowY: `hidden`,
                  width: 0,
                  py: 3,
                  flexWrap: `nowrap`,
                  position: `relative`
                }}
              >
                {
                  liveMints != undefined ?
                    (
                      liveMints.map((livemint: any, index: number) => {
                        return (
                          <Grid
                            item
                            key={index}
                            onClick={() => {
                              if (livemint?.link) {
                                window.open(livemint?.link, '_blank');
                              }
                            }}
                            sx={{
                              transition: `all 0.3s`,
                              '&:hover': {
                                transform: `scale(1.03)`,
                                cursor: `pointer`
                              },

                            }}
                          >
                            <Box
                              sx={{
                                width: '248px',
                                maxWidth: `248px`,
                                height: '20px',
                                backgroundColor: theme => theme.palette.neutral.main,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8
                              }}
                            ></Box>
                            <Box sx={{
                              width: '100%',
                              height: '120px',
                              position: 'relative',
                              backgroundImage: livemint?.image ? `url('${livemint?.image}')` : ``,
                              backgroundColor: theme => theme.palette.neutral.common,
                              backgroundSize: `contain`,
                              backgroundRepeat: `repeat`,
                              backgroundPosition: `center`,
                              textAlign: `center`
                            }} >
                              <Typography variant="h6" sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%,-50%)',
                                cursor: `pointer`
                              }} >
                                {livemint?.name}
                              </Typography>
                            </Box>
                            <Box sx={{
                              background: theme => theme.palette.neutral.main,
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8,
                              py: 2,
                              px: 1
                            }} >
                              <Grid
                                container
                                direction={`row`}
                                justifyContent='space-between'
                                sx={{ p: 0 }}>
                                <Grid
                                  item xs={6}
                                  textAlign='center'
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: `center`
                                  }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                                    Supply
                                  </Typography>
                                  <Typography variant='h6' sx={{ mb: 1.5 }}>
                                    {livemint?.supply}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: `center`
                                }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                                    Price
                                  </Typography>
                                  <Typography variant='h6' sx={{ mb: 1.5 }}>
                                    {livemint?.price}
                                    <Box
                                      component={`img`}
                                      src={`/images/icons/sol.svg`}
                                      sx={{
                                        ml: 0.5,
                                        width: `12px`,
                                        height: `12px`
                                      }}
                                      onError={handleImageError}
                                    >
                                    </Box>
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  textAlign='center'
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    pt: `4px !important`
                                  }}
                                >
                                  <Typography variant={`subtitle2`} sx={{ pb: 1 }}>
                                    Mint Launch
                                  </Typography>

                                  <Typography variant="h6">
                                    {
                                      moment(livemint?.timestamp).format('MMM.DD')
                                    }
                                    &nbsp;&nbsp;
                                    {
                                      moment(livemint?.timestamp).format('hh:mm')
                                    }
                                    &nbsp;&nbsp;
                                    {
                                      moment(livemint?.timestamp).format('A')
                                    }
                                    &nbsp;&nbsp;
                                    {
                                      new Date(livemint?.timestamp).toLocaleString('en', { timeZoneName: 'short' }).split(' ').pop()
                                    }
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        )
                      })
                    ) :
                    (
                      new Array(LIMIT_COLUMNS).fill(undefined).map((collection: any, index: number) => {
                        return (
                          <Grid
                            item
                            key={index}
                          >
                            <Box
                              sx={{
                                width: '248px',
                                maxWidth: `248px`,
                                height: '20px',
                                backgroundColor: theme => theme.palette.neutral.main,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8
                              }}
                            ></Box>
                            <Box sx={{
                              width: '100%',
                              height: '120px',
                              position: 'relative',
                              backgroundColor: theme => theme.palette.neutral.common,
                              backgroundSize: `contain`,
                              backgroundRepeat: `repeat`,
                              backgroundPosition: `center`,
                              textAlign: `center`
                            }} >
                              <Typography variant="h6" sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%,-50%)',
                                cursor: `pointer`
                              }} >
                                <Skeleton animation="wave" sx={{ width: `96px` }} />
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                background: theme => theme.palette.neutral.main,
                                borderBottomLeftRadius: 8,
                                borderBottomRightRadius: 8,
                                py: 2, px: 1
                              }}
                            >
                              <Grid
                                container
                                direction={`row`}
                                justifyContent='space-between'
                                sx={{ p: 0 }}>
                                <Grid
                                  item
                                  xs={6}
                                  textAlign='center'
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: `center`
                                  }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                                    Supply
                                  </Typography>
                                  <Typography variant='h6' sx={{ mb: 1.5, textAlign: `center` }}>
                                    <Skeleton animation="wave" sx={{ width: `70%`, mx: `auto` }} />
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: `center`
                                }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                                    Price
                                  </Typography>
                                  <Typography variant='h6' sx={{ mb: 1.5, textAlign: `center` }}>
                                    <Skeleton animation="wave" sx={{ width: `70%`, mx: `auto` }} />
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  textAlign='center'
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    pt: `4px !important`
                                  }}
                                >
                                  <Typography variant={`subtitle2`} sx={{ pb: 1 }}>
                                    Mint Launch
                                  </Typography>

                                  <Typography variant="h6">
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        )
                      })
                    )
                }
              </Grid>
            </Box>

            <Box component={`section`} sx={{
              px: {
                md: 13,
                ss: 2,
                xs: 6,
                sm: 8
              },
              py: 4
            }} >
              <Typography variant='h6' >Top Volume</Typography>
              <Grid container spacing={1.5}
                sx={{
                  my: 2,
                  minWidth: `100%`,
                  maxWidth: `100%`,
                  // maxWidth: '82%',
                  overflowX: 'auto',
                  overflowY: `hidden`,
                  width: 0,
                  py: 3,
                  flexWrap: `nowrap`
                }} >
                {
                  topCollections != undefined ?
                    (
                      topCollections.map((collection: any, index: number) => {
                        return (
                          <Grid item key={index} sx={{
                            transition: `all 0.3s`,
                            '&:hover': {
                              transform: `scale(1.03)`,
                              cursor: `pointer`
                            },
                          }}>
                            <Box
                              sx={{
                                width: '316px',
                                maxWidth: `316px`,
                                height: '20px',
                                background: theme => theme.palette.neutral.main,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8
                              }}
                            ></Box>
                            <Grid
                              container
                              direction={`row`}
                              alignItems={`stretch`}
                              justifyContent={`space-between`}
                              sx={{
                                width: '100%',
                                height: '120px',
                                position: 'relative',
                              }}
                            >
                              <Typography variant="h6" sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%,-50%)',
                                cursor: `pointer`,
                                zIndex: 9
                              }} >
                                {collection?.name}
                              </Typography>
                              {
                                new Array(3).fill(undefined).map((item: any, index: number) => {
                                  return (
                                    <Grid
                                      xs={
                                        index == 1 ? 6 : 3
                                      }
                                      sx={{
                                        overflow: `hidden`,
                                      }}
                                      key={index}
                                    >
                                      <Box sx={{
                                        width: index == 1 ? '100%' : `200%`,
                                        overflow: `hidden`,
                                        height: '120px',
                                        position: 'relative',
                                        background: theme => theme.palette.neutral.common,
                                        backgroundImage: `url(${collection?.image})`,
                                        backgroundSize: `cover`,
                                        backgroundRepeat: `no-repeat`,
                                        backgroundPosition: `center`,
                                        textAlign: `center`
                                      }} >
                                        {/* <Link href={`https://magiceden.io/marketplace/${collection?.symbol}`}>
                          <a target={`_blank`}>

                          </a>
                        </Link> */}
                                      </Box>
                                    </Grid>
                                  )
                                })
                              }
                            </Grid>

                            <Box sx={{
                              background: theme => theme.palette.neutral.main,
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8
                            }} >
                              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px', mt: 0 }} >
                                <Grid item lg={4} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px'
                                }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                                    floor
                                  </Typography>
                                  <Typography variant='h6' sx={{ mb: 1 }}>
                                    {numberToFix(collection?.floor / LAMPORTS_PER_SOL)}
                                    <Box
                                      component={`img`}
                                      src={`/images/icons/sol.svg`}
                                      sx={{
                                        ml: 0.5,
                                        width: `12px`,
                                        height: `12px`
                                      }}
                                      onError={handleImageError}
                                    >
                                    </Box>
                                  </Typography>

                                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                                    {
                                      collection?.floorChange && collection?.floorChange < 0 ? <RedDown sx={{ width: `0.75rem`, height: `0.75rem`, mr: 0.5 }} /> : ``
                                    }

                                    {
                                      collection?.floorChange && collection?.floorChange > 0 ? <GreenUp sx={{ width: `0.75rem`, height: `0.75rem`, mr: 0.5 }} /> : ``
                                    }
                                    <Typography variant='subtitle2' >{numberToFix(collection?.floorChange * 100)}%</Typography>
                                  </Box>
                                </Grid>

                                <Grid item lg={4} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px'
                                }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>listings</Typography>
                                  <Typography variant='h6' sx={{ mb: 1 }}>{collection?.listed}</Typography>
                                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                                    {
                                      collection?.listRatio && collection?.listRatio < 0 ? <RedDown sx={{ width: `0.75rem`, height: `0.75rem`, mr: 0.5 }} /> : ``
                                    }

                                    {
                                      collection?.listRatio && collection?.listRatio > 0 ? <GreenUp sx={{ width: `0.75rem`, height: `0.75rem`, mr: 0.5 }} /> : ``
                                    }
                                    <Typography variant='subtitle2' >{numberToFix(collection?.listRatio * 100)}%</Typography>
                                  </Box>
                                </Grid>

                                <Grid item lg={4} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px'
                                }}>
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>volume</Typography>
                                  <Typography variant='h6' sx={{ mb: 1 }}>
                                    {
                                      numberToFix(collection?.volume24hr / LAMPORTS_PER_SOL)
                                    }
                                    <Box
                                      component={`img`}
                                      src={`/images/icons/sol.svg`}
                                      sx={{
                                        ml: 0.5,
                                        width: `12px`,
                                        height: `12px`
                                      }}
                                      onError={handleImageError}
                                    >
                                    </Box>
                                  </Typography>
                                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                                    {
                                      collection?.volume24hr && collection?.volume24hr < 0 ? <RedDown sx={{ width: `0.75rem`, height: `0.75rem`, mr: 0.5 }} /> : ``
                                    }

                                    {
                                      collection?.volume24hr && collection?.volume24hr > 0 ? <GreenUp sx={{ width: `0.75rem`, height: `0.75rem`, mr: 0.5 }} /> : ``
                                    }
                                    <Typography variant='subtitle2' >4.69%</Typography>
                                  </Box>
                                </Grid>

                              </Grid>

                            </Box>
                          </Grid>
                        )
                      })
                    ) :
                    (
                      new Array(LIMIT_COLUMNS).fill(undefined).map((collection: any, index: number) => {
                        return (
                          <Grid item key={index}>
                            <Box
                              sx={{
                                width: '316px',
                                height: '20px',
                                background: theme => theme.palette.neutral.main
                              }}
                            ></Box>
                            <Box sx={{
                              width: '100%',
                              height: '120px',
                              position: 'relative',
                              background: theme => theme.palette.neutral.common
                            }} >
                              <Typography variant="h6" sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%,-50%)'
                              }} >
                                <Skeleton animation="wave" sx={{ width: `96px` }} />
                              </Typography>
                            </Box>
                            <Box sx={{
                              background: theme => theme.palette.neutral.main
                            }} >
                              <Grid container spacing={3} justifyContent='space-between' sx={{ padding: '0px 20px 20px 20px', mt: 0 }} >
                                <Grid item lg={4} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px'
                                }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                                    floor
                                  </Typography>
                                  <Typography variant='h6' sx={{ mb: 1 }}>
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>

                                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                                    <Typography variant='subtitle2' >
                                      <Skeleton animation="wave" sx={{ width: `24px` }} />
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item lg={4} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px'
                                }} >
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>listings</Typography>
                                  <Typography variant='h6' sx={{ mb: 1 }}><Skeleton animation="wave" sx={{ width: `100%` }} /></Typography>
                                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                                    <Typography variant='subtitle2' >
                                      <Skeleton animation="wave" sx={{ width: `24px` }} />
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item lg={4} textAlign='center' sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '5px'
                                }}>
                                  <Typography variant='subtitle2' sx={{ mb: 1.5 }}>volume</Typography>
                                  <Typography variant='h6' sx={{ mb: 1 }}>
                                    <Typography variant='subtitle2' >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </Typography>
                                  </Typography>
                                  <Box display='flex' justifyContent={`center`} alignItems={`center`} >
                                    <Typography variant='subtitle2' >
                                      <Skeleton animation="wave" sx={{ width: `24px` }} />
                                    </Typography>
                                  </Box>
                                </Grid>

                              </Grid>

                            </Box>
                          </Grid>
                        )
                      })
                    )
                }
              </Grid>
            </Box>

            <Box component={`section`} sx={{
              px: {
                md: 13,
                ss: 2,
                xs: 6,
                sm: 8
              }, py: 4
            }} >
              <Grid container direction={`row`} spacing={2} >
                <Grid item ss={12} md={6} xl={3} >
                  <Typography variant={`h6`} sx={{ py: 1 }} >Top Movers</Typography>

                  <TableContainer sx={{
                    minHeight: '40vh',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    overflowX: `hidden`
                  }} >
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead
                        sx={{
                          border: 'none',

                        }}
                      >
                        <TableRow>
                          {
                            topMoversField.map((item: any, idx: any) => (
                              <TableCell
                                sx={{
                                  background: theme => theme.palette.neutral.main,
                                  textAlign: {
                                    ss: idx == 0 ? 'left' : 'center'
                                  },
                                  border: 'none',
                                  width: idx == 0 ? '40%' : '30%'
                                }}
                                key={idx}
                              >
                                <Typography variant='subtitle2'>
                                  {item.title}
                                </Typography>
                              </TableCell>
                            ))
                          }

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          topMovers != undefined ?
                            (
                              topMovers.map((collection: any, index: number) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }} >
                                      {/* <Link href={`https://magiceden.io/marketplace/${collection?.symbol}`}>
                                  <a target={`_blank`}>

                                  </a>
                                </Link> */}
                                      <Typography variant='subtitle2'>
                                        {collection?.name}
                                      </Typography>

                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        background: theme => theme.palette.neutral.common,
                                        textAlign: 'center',
                                        border: 'none'
                                      }}
                                    >
                                      <Typography variant='subtitle2'>
                                        {
                                          numberToFix(collection?.avgSale / LAMPORTS_PER_SOL)
                                        }
                                        <Box
                                          component={`img`}
                                          src={`/images/icons/sol.svg`}
                                          sx={{
                                            ml: 0.5,
                                            width: `10px`,
                                            height: `10px`
                                          }}
                                          onError={handleImageError}
                                        >
                                        </Box>
                                      </Typography>

                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >

                                      <Typography variant='subtitle2'>
                                        {
                                          collection?.avgSaleChange && collection?.avgSaleChange < 0 ? <RedDown sx={{ width: `0.65rem`, height: `0.65rem`, mr: 0.5 }} /> : ``
                                        }

                                        {
                                          collection?.avgSaleChange && collection?.avgSaleChange > 0 ? <GreenUp sx={{ width: `0.65rem`, height: `0.65rem`, mr: 0.5 }} /> : ``
                                        }
                                        {
                                          numberToFix(collection?.avgSaleChange * 100)
                                        }
                                        %
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            ) :
                            (
                              new Array(LIMIT_COLUMNS).fill(undefined).map((collection: any, index: number) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            )
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Grid>

                <Grid item ss={12} md={6} xl={3} >
                  <Typography variant={`h6`} sx={{ py: 1 }} >New NFT Arrivals</Typography>

                  <TableContainer sx={{
                    minHeight: '40vh',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    position: `relative`
                  }} >
                    {/* <Typography
                variant={`h6`}
                sx={{
                  position: `absolute`,
                  top: `50%`,
                  left: `50%`,
                  transform: `translate(-50%, -50%)`,
                  zIndex: 999999
                }}
              >
                Pending development...
              </Typography> */}
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead
                        sx={{
                          border: 'none'
                        }}
                      >
                        <TableRow
                        // sx={{
                        //   filter: `blur(4px)`
                        // }}
                        >
                          {
                            newCollectionField.map((item: any, idx: any) => (
                              <TableCell
                                sx={{
                                  background: theme => theme.palette.neutral.main,
                                  textAlign: {
                                    ss: idx == 0 ? 'left' : 'center'
                                  },
                                  border: 'none',
                                  width: idx == 0 ? '40%' : '30%'
                                }}
                                key={idx}
                              >
                                <Typography variant='subtitle2'>
                                  {item.title}
                                </Typography>

                              </TableCell>
                            ))
                          }

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          newCollections != undefined ?
                            (
                              newCollections.map((collection: any, index: number) => {
                                return (
                                  // <React.Fragment key={index}></React.Fragment>
                                  <TableRow key={index}>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      {/* <Link href={`https://magiceden.io/marketplace/${collection?.symbol}`}>
                                  <a target={`_blank`}>

                                  </a>
                                </Link> */}
                                      <Typography variant='subtitle2'>
                                        {collection?.name}
                                      </Typography>

                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => theme.palette.neutral.common }}>
                                      <Typography variant='subtitle2'>
                                        {
                                          moment(collection?.registed).format('DD.MM')
                                        }
                                      </Typography>

                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => theme.palette.neutral.common }}>
                                      <Typography variant='subtitle2'>
                                        {
                                          moment(collection?.registed).format('HH:MM')
                                        }
                                      </Typography>

                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            ) :
                            (
                              new Array(LIMIT_COLUMNS).fill(undefined).map((collection: any, index: number) => {
                                return (
                                  // <React.Fragment key={index}></React.Fragment>
                                  <TableRow key={index}>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => theme.palette.neutral.common }}>
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', border: 'none', background: theme => theme.palette.neutral.common }}>
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            )
                        }

                        {
                          // new Array(4).fill(undefined).map((item: any, index: number) => {
                          //   return (
                          //     <TableRow
                          //       sx={{
                          //         filter: `blur(4px)`
                          //       }}
                          //       key={index}
                          //     >
                          //       <TableCell
                          //         sx={{
                          //           border: 'none',
                          //           background: theme => theme.palette.neutral.common
                          //         }}
                          //       >
                          //         <Typography variant='subtitle2'>
                          //           Collection
                          //         </Typography>
                          //       </TableCell>
                          //       <TableCell
                          //         sx={{
                          //           textAlign: 'center',
                          //           border: 'none',
                          //           background: theme => theme.palette.neutral.common
                          //         }}
                          //       >
                          //         <Typography variant='subtitle2'>
                          //           01.01
                          //         </Typography>

                          //       </TableCell>
                          //       <TableCell
                          //         sx={{
                          //           textAlign: 'center',
                          //           border: 'none',
                          //           background: theme => theme.palette.neutral.common
                          //         }}
                          //       >
                          //         <Typography variant='subtitle2'>
                          //           00:00
                          //         </Typography>

                          //       </TableCell>
                          //     </TableRow>
                          //     )
                          // })
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Grid>

                <Grid item ss={12} md={6} xl={3} >
                  <Typography variant={`h6`} sx={{ py: 1 }} >New Token Arrivals</Typography>

                  <TableContainer sx={{
                    minHeight: '40vh',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    overflowX: `hidden`
                  }} >
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead
                        sx={{
                          border: 'none'
                        }}
                      >
                        <TableRow>
                          {
                            newTokenField.map((item: any, idx: any) => (
                              <TableCell
                                sx={{
                                  background: theme => theme.palette.neutral.main,
                                  textAlign: {
                                    ss: idx == 0 ? 'left' : 'center'
                                  },
                                  border: 'none',
                                  width: idx == 0 ? '40%' : '30%'
                                }}
                                key={idx}
                              >
                                <Typography variant='subtitle2'>
                                  {item.title}
                                </Typography>

                              </TableCell>
                            ))
                          }

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          newTokens != undefined ?
                            (
                              newTokens.map((token: any, index: number) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      {/* <Link href={`https://solscan.io/token//${token?.address}`}>
                                  <a target={`_blank`}>
 
                                  </a>
                                </Link> */}
                                      <Typography variant='subtitle2'>
                                        {token?.name}
                                      </Typography>

                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Typography variant='subtitle2'>
                                        {
                                          moment(token?.registed).format('DD.MM')
                                        }
                                      </Typography>

                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Typography variant='subtitle2'>
                                        {
                                          moment(token?.registed).format('HH:ss')
                                        }
                                      </Typography>

                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            ) :
                            (
                              new Array(LIMIT_COLUMNS).fill(undefined).map((token: any, index: number) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell
                                      sx={{
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}
                                    >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: 'center',
                                        border: 'none',
                                        background: theme => theme.palette.neutral.common
                                      }}>
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            )
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Grid>

                <Grid item ss={12} md={6} xl={3} >
                  <Typography variant={`h6`} sx={{ py: 1 }} >Upcoming</Typography>

                  <TableContainer sx={{
                    minHeight: '40vh',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    position: `relative`
                  }}>
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead
                        sx={{
                          border: 'none'
                        }}
                      >
                        <TableRow>
                          {
                            upcomingField.map((item: any, idx: any) => (
                              <TableCell
                                sx={{
                                  background: theme => theme.palette.neutral.main,
                                  textAlign: {
                                    ss: idx == 0 ? 'left' : 'center'
                                  },
                                  border: 'none',
                                  width: idx == (upcomingField?.length - 1) ? '30%' : 'auto'
                                }}
                                key={idx}
                              >
                                <Typography variant='subtitle2'>
                                  {item.title}
                                </Typography>

                              </TableCell>
                            ))
                          }

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          upcomings != undefined ?
                            (
                              upcomings.map((collection: any, index: number) => {
                                return (
                                  <TableRow>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      <Typography variant='subtitle2'>
                                        {
                                          collection?.name
                                        }
                                      </Typography>

                                    </TableCell>
                                    <TableCell sx={{ border: 'none', textAlign: `center`, background: theme => theme.palette.neutral.common }} >
                                      <Typography variant='subtitle2'>
                                        {
                                          moment(collection?.timestamp).format('MM.DD HH:ss')
                                        }
                                      </Typography>

                                    </TableCell>
                                    <TableCell sx={{ border: 'none', textAlign: `center`, background: theme => theme.palette.neutral.common }} >
                                      <Typography variant='subtitle2'>
                                        {
                                          collection?.supply
                                        }
                                      </Typography>

                                    </TableCell>
                                    <TableCell sx={{ border: 'none', textAlign: `center`, background: theme => theme.palette.neutral.common }} >
                                      <Typography variant='subtitle2'>
                                        {
                                          numberToFix(collection?.price)
                                        }
                                        <Box
                                          component={`img`}
                                          src={`/images/icons/sol.svg`}
                                          sx={{
                                            ml: 0.5,
                                            width: `10px`,
                                            height: `10px`
                                          }}
                                          onError={handleImageError}
                                        >
                                        </Box>
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            ) :
                            (
                              new Array(LIMIT_COLUMNS).fill(undefined).map((collection: any, index: number) => {
                                return (
                                  <TableRow>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                    <TableCell sx={{ border: 'none', background: theme => theme.palette.neutral.common }} >
                                      <Skeleton animation="wave" sx={{ width: `100%` }} />
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            )
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Grid>
              </Grid>
            </Box>
          </> :
          <Box component={`section`} sx={{
            px: {
              md: 13,
              ss: 2,
              xs: 6,
              sm: 8
            },
            py: 4
          }}>
            <Typography variant='h6' >
              Welcome
            </Typography>
            <Typography variant='h6' sx={{ mt: 2 }}>
              Please connect to your wallet
            </Typography>
            <Typography variant='h6' >
              to use the Snapshot Toolkit
            </Typography>

            <Typography variant='subtitle2' sx={{ mt: 1.5 }}>
              Get the data you’re looking for quickly and reliably for your NFT research needs.
            </Typography>
            <Typography variant='subtitle2' sx={{ mt: 1.5 }}>
              For assistance, reach out to the community  or the moderators within the Discord.
            </Typography>

            <PaperButton size={`medium`} selected={false}
              sx={{
                borderRadius: 1,
                mt: 2,
                px: `24px !important`,
                py: `8px !important`
              }}
              onClick={() => {
                router.push(`/profile`);
              }}
            >
              <ProfileIcon />
              <Typography
                variant={`subtitle2`}
                sx={{ ml: 1 }}
              >
                Profile
              </Typography>
            </PaperButton>
          </Box>
      }



    </Box >
  );
}

export default Home;