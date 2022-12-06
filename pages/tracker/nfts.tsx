import React, { Fragment, MouseEventHandler, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';
import InfiniteScroll from "react-infinite-scroll-component";
import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { createTheme, responsiveFontSizes } from "@mui/material";
import Autocomplete, { createFilterOptions, autocompleteClasses } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import ButtonGroup from '@mui/material/ButtonGroup';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Stack from "@mui/material/Stack";
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar } from "@mui/material";

import PaperButton from "src/components/PaperButton";
import AddPlus from 'src/components/IconButton/AddPlus';
import ZoomGlass from 'src/components/IconButton/ZoomGlass';
import WhiteCircle from 'src/components/IconButton/WhiteCircle';
import WhiteDown from 'src/components/IconButton/WhiteDown';
import WhiteUp from "@components/IconButton/WhiteUp";
// import WhiteUp from 'src/components/IconButton/WhiteUp';
import CloseCancel from 'src/components/IconButton/CloseCancel';
import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';

import { numberToFix, parseNumber } from "src/common/utils/helpers"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, TIME_INCREASE, CORS_PROXY_SERVER, SNIPER_API, CLOUD_FLARE_URI, TrendsField } from "src/common/config";

import { delayTime, useInterval } from "src/helper/utility";
import { handleImageError } from "src/common/utils/handleImageError";

import fetchData from "src/common/services/getDataWithAxios";

import PageInfo from "src/components/PageContainer/PageInfo";
import { LIMIT_PAGE_SIZE } from '../../src/common/config';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    // fontSize: '20px !important ',
    '& .MuiAutocomplete-popper': {
      margin: '20px'
    },
  },
});


let tempOriginalData = [];

const Nfts = () => {
  const router = useRouter();
  const theme = createTheme()
  // For data
  const [collectibles, setCollectibles] = useState<any>([]);
  const [myTracks, setMyTracks] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(true);
  const [originalTracks, setOriginalTracks] = useState<any>([]);
  const [originalPercent, setOriginalPercent] = useState<any>([]);

  // For get scroll infinit
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(1);

  // For delete Collection
  const [deleteCollection, setDeleteCollection] = useState<string>(``);
  // For Alert
  const [openConf, setOpenConf] = useState<boolean>(false);

  // For Real time fetching
  const [timer, setTimer] = React.useState<number>(0);

  // For Register Collection
  const [registCollection, setRegistCollection] = useState<any>([]);

  // For user login
  const [isSigned, setIsSigned] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>(`root`);

  // For Load More
  const [loadIndex, setLoadIndex] = useState<number>(0);

  // For sorting
  const [sortField, setSortField] = useState<string>('volume24hr');
  const [sortMode, setSortMode] = useState<boolean>(false);

  // For searching
  const [trackSearch, setTrackSearch] = useState<string>('');
  const [startSearch, setStartSearch] = useState<boolean>(true);

  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);

  const [visibleTrendFields, setVisibleTrendsField] = useState<TrendsField>(TrendsField.LIST);

  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsShowMessage(false);
  };
  const [autoField, setAutoField] = useState('')
  // For loading
  const [showLoading, setShowLoading] = React.useState<boolean>(false);

  // For scrolling by clicking button
  // const step = 8;
  // const scrollRef: any = useRef();
  // const isScrollRef: any = useRef();
  // const scrollMove = () => {
  //   if (isScrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollTop + step;
  //     requestAnimationFrame(scrollMove);
  //   }
  // };

  const [nftCollection, setNftCollection] = useState([])
  const [trackFields, setTrackFields] = useState([
    {
      menu: `projects`,
      field: `name`,
      isStatistic: false,
      isLamport: false,
      type: null
    },
    {
      menu: `supply`,
      field: `supply`,
      isStatistic: false,
      isLamport: false,
      type: ``
    },
    {
      menu: `listed`,
      field: `listed`,
      isStatistic: false,
      isLamport: false,
      type: TrendsField.LIST
    },
    {
      menu: `list ratio`,
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
      field: `volume`,
      isStatistic: false,
      isLamport: true,
      type: ``
    },
    {
      menu: `24h volume`,
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
  ]);

  const getSelectibles = async (filter: string) => {
    try {
      const res: any = await getAllCollections(filter)
      setCollectibles([...res]);
    }
    catch (err) {

    }
  }

  const addCollection = async () => {
    if (registCollection.length > 0) {
      let succeed = 0, failed = 0, total = registCollection.length;
      setShowLoading(true);
      try {
        let res: any[] = [];
        for (let i = 0; i < total; i++) {
          const result: any = await fetchData({
            method: `post`,
            route: `${DATA_API.TRACK_NFTS.REGIST_TRACKS}/${userName}`,
            data: {
              symbol: registCollection[i]?.symbol
            }
          });

          if (result && Array.isArray(result?.nfts)) {
            res = result?.nfts || [];
            succeed++;
          }
          else {
            failed++;
          }
        }

        if (res?.length > 0) {
          setOriginalTracks([...res]);
          setLoaded(!loaded);
          tempOriginalData = [...res];
        }

        setIsShowMessage(true);
        setMessageContent(`Succeed: ${succeed} and Failed: ${failed} (In total of ${total})`);
        setMessageSeverity(`info`);
      }
      catch (err) {
        console.log(`add collection err`, err)
        setIsShowMessage(true);
        setMessageContent(`Operation is failed! Please check your network! Succeed: (${succeed} and Failed: ${failed} [In total of ${total}])`);
        setMessageSeverity(`error`);
      }
      finally {
        setShowLoading(false);
        setRegistCollection([]);
        setCollectibles([]);
      }
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Please select more than one collection!`);
      setMessageSeverity(`warning`);
    }
  }

  const deleteOneCollection = async () => {
    if (deleteCollection) {
      setShowLoading(true);
      try {
        const result = await fetchData({
          method: `post`,
          route: `${DATA_API.TRACK_NFTS.DELETE_TRACKS}/${userName}/delete`,
          data: {
            symbol: deleteCollection
          }
        });
        if (result) {
          const filtered = tempOriginalData.filter((track: any, index: number) => { return track.symbol != deleteCollection });
          setOriginalTracks([...filtered]);
          tempOriginalData = [...filtered];
          setLoaded(!loaded);
          setIsShowMessage(true);
          setMessageContent(`Selected collection deleted!`);
          setMessageSeverity(`info`);
        }
        else {
          setIsShowMessage(true);
          setMessageContent(`Operation is failed! Please check your network!`);
          setMessageSeverity(`error`);
        }

      }
      catch (err) {
        setIsShowMessage(true);
        setMessageContent(`Operation is failed! Please check your network!`);
        setMessageSeverity(`error`);
      }
      finally {
        setOpenConf(false);
        setShowLoading(false);
      }
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Please select the collection!`);
      setMessageSeverity(`warning`);
    }
  }
  // For Handle Alert Modal
  const closeConfDialog = () => {
    setOpenConf(false);
  }

  const sortAndSearchTracks = async () => {
    let result = null;
    if (sortField) {
      let tempMyTrackData = tempOriginalData;
      tempMyTrackData.sort((a: any, b: any) => {
        if (sortField == `name`) {
          return sortMode ? ('' + a[sortField]).localeCompare(b[sortField]) : ('' + b[sortField]).localeCompare(a[sortField]);
        }
        else {
          return sortMode ? (a[sortField] - b[sortField]) : (b[sortField] - a[sortField]);
        }
      });

      result = tempMyTrackData;
    }
    if (trackSearch) {
      let tempMyTrackData = result ? result : tempOriginalData;
      let lowerSearch = trackSearch.toLocaleLowerCase();
      let res = tempMyTrackData.filter((track: any, index: number) => {
        let lowerName = track?.name.toLocaleLowerCase();
        return lowerName.includes(lowerSearch);
      });
      result = res;
    }
    else {
      result = result ? result : tempOriginalData;
    }

    setMyTracks([...result]);
  }

  const fetchScrollTrack = async () => {
    try {
      setOffset(offset + 1);
      const tracks: any = await fetchData({
        method: `get`,
        route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${offset}&page_size=${LIMIT_COLUMNS}`
      });
      let res = [];
      if (tracks?.length > 0) {
        res = tracks || [];

        tempOriginalData = [...tempOriginalData, ...res];
        setOriginalTracks([...tempOriginalData, ...res]);
        setLoaded(!loaded);
      }

      if (res.length < LIMIT_COLUMNS) {
        setHasMore(false);
      }
      else {
        setHasMore(true);
      }
    }
    catch (err) {
      setHasMore(false);
    }
  }

  const getTrackers = async () => {
    new Promise((myResolve, myReject) => {
      const trackersFromDB: any = fetchData({
        method: `get`,
        route: `${DATA_API.TRACK_NFTS.FETCH_TRACKS}/${userName}?offset=${offset - 1}&page_size=${LIMIT_COLUMNS}`
      });

      myResolve(trackersFromDB);
    }).then(async (res) => {
      if (res) {
        const result: any = res;
        if (result && Array.isArray(result)) {
          setShowLoading(false);
          if (result.length < LIMIT_COLUMNS) {
            setHasMore(false);
          }
          startTimeInterval();
          setOriginalTracks([...result]);
          setLoaded(!loaded);
          tempOriginalData = [...result];
          if (result.length == LIMIT_COLUMNS) {
            setHasMore(true);
          }
        }
      }
    });
  }

  const startTimeInterval = async () => {

    const intervalId = window.setInterval(async () => {
      setTimer(timer => timer + TIME_INCREASE);
    }, TIME_RANGE * 6)
    return intervalId;
  }

  const getAllCollections = async (filter: string) => {
    const res = await fetchData({
      method: `get`,
      route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/?offset=${0}&page_size=${20000}&symbol=${filter}`
    })
    return res
  }

  const getDetailCollection = async () => {
    // for (let i = 0; i < res.length; i++) {

    // }
    for (let i = 0; i < tempOriginalData.length; i++) {

      new Promise((myResolve, myReject) => {
        const trackersFromDB: any = fetchData({
          method: `post`,
          route: `${DATA_API.GET_COLLECTION_DETAIL.COMMON}/${userName}${DATA_API.GET_COLLECTION_DETAIL.DETAIL}`,
          data: {
            user: `root`,
            symbol: tempOriginalData[i]?.symbol
          }
        });
        myResolve(trackersFromDB);
      }).then(async (res) => {
        if (res) {
          const result: any = res;
          if (result && result?.symbol) {
            let changed = tempOriginalData.map((record: any) => {
              if (record?.symbol == result?.symbol) {
                return result;
              }
              else {
                return record;
              }
            })
            setOriginalTracks([...changed]);
            setLoaded(!loaded);
            tempOriginalData = [...changed];
          }
        }
      });
    }

  }


  useEffect(() => {
    (async () => {
      tempOriginalData = [];
      try {
        setShowLoading(true);
        getTrackers();
        let tickerInterval = await startTimeInterval();
        return () => clearInterval(tickerInterval);
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await sortAndSearchTracks();
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [originalTracks, loaded, sortMode, sortField, startSearch]);

  useEffect(() => {
    (async () => {
      try {
        getDetailCollection()
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [timer]);

  return (
    <>
      <PageInfo>
        <Box
          sx={{
            display: {
              ss: `block`,
              sm: `flex`
            },
            // [theme.breakpoints.up(`md`)]: { display: `flex` },
            // [theme.breakpoints.down(`md`)]: { display: `block` },
            [theme.breakpoints.down(768)]: { pt: 2 },
            justifyContent: `flex-end`,
            flexGrow: {
              ss: 2,
              lg: 1
            }
          }}
        >
          <Box
            sx={{
              width: `100%`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `right`
            }}
          >
            <AddPlus
              sx={{
                width: `1.75rem`,
                height: `1.75rem`,
                mr: {
                  sm: 1
                },
                '&:hover': {
                  cursor: `pointer !important`,
                  opacity: 0.7
                },
                color: `white`
              }}
              onClick={async () => {
                await addCollection();
              }}
            />
            <Autocomplete
              multiple
              id="tags-outlined"
              options={collectibles}
              getOptionLabel={(option: { name: string, symbol: string, image: string }) => option.name}
              renderOption={(props, option: any) => (
                <li {...props} key={option.symbol}  >{option.name}</li>
                // <Typography   {...props} key={option.symbol} style={{ fontSize: '0.75rem !important ' }}>{option.name}</Typography>
              )}
              renderInput={(params) => (

                <TextField
                  value={autoField}
                  {...params}
                  sx={{
                    '& input': {
                      fontSize: `0.75rem`,
                      fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                    },
                  }}
                  placeholder={
                    `add project`
                  }
                  onChange={(e) => {

                  }}
                >

                </TextField>

              )}
              PopperComponent={StyledPopper}
              size={`small`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>, newValue) => {
                setRegistCollection([...newValue]);
              }}
              onInputChange={async (event, newInputValue) => {
                if (newInputValue.length > 2) {
                  await getSelectibles(newInputValue);
                }
                else {
                  if (newInputValue.length < 1) {
                    setCollectibles([]);
                  }
                }

              }}
              sx={{
                width: `100%`,
                ml: 2,
                mr: {
                  sm: 2
                },
                border: `none`,
                '& .MuiFormControl-root .MuiInputBase-root': {
                  py: `4px !important`,
                },
              }}

              value={registCollection}
            />
          </Box>

          <Box
            sx={{
              width: `100%`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `right`,
              [theme.breakpoints.down(768)]: { pt: 2 }
            }}
          >
            <ZoomGlass
              sx={{
                width: `1.75rem`,
                height: `1.75rem`,
                ml: {
                  sm: 3,
                  ss: 0
                },
                mr: {
                  sm: 1
                },
                '&:hover': {
                  cursor: `pointer`,
                  opacity: 0.7
                },
                color: `white`
              }}
              onClick={async () => {
                setStartSearch(!startSearch)
              }}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={trackSearch}
              size={`small`}
              sx={{
                width: `100%`,
                ml: 2,
                border: `none`,
                '& input': {
                  fontSize: `0.75rem`,
                  py: 0.875,
                  borderRadius: `4px`,
                  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                },
              }}
              placeholder={`search tracker`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTrackSearch(event.target.value);
              }}

              onKeyDown={async (event) => {
                if (event.keyCode == 13) {
                  setStartSearch(!startSearch)
                }
              }}
            />
          </Box>
        </Box>
      </PageInfo>

      <Box component='section'
        sx={{
          display: {
            ss: `flex`,
            md: `none`
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
          pt: 3,
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

      <Box
        sx={{
          mx: `auto`,
          py: 3,
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
          background: `none`,
          position: `relative`,
          // overflow: `hidden !important`,
          // '& *': {
          //   overflow: `hidden !important`
          // }
        }}
      >
        <TableContainer
          component={`div`}
          sx={{
            overflow: {
              md: `hidden `,
              ss: `auto`
            },
            position: `relative`
          }}
        >
          <InfiniteScroll
            dataLength={myTracks.length}
            next={async () => { await fetchScrollTrack() }}
            hasMore={hasMore}
            loader={
              <Typography variant={`h6`} sx={{ mt: 2, mx: `auto`, textAlign: `center` }}>
                {myTracks.length < 1 ? `` : `Loading...`}
              </Typography>
            }
          >
            <Table sx={{

              // minWidth: `880px`
            }}>
              <TableHead
              >
                <TableRow>
                  <TableCell
                    sx={{
                      border: `none`,
                      width: `5%`,
                      py: 1,
                      background: theme => theme.palette.neutral.main,
                      [theme.breakpoints.down(1024)]: { display: `none` }
                    }}
                  >

                  </TableCell>

                  <TableCell
                    sx={{
                      border: `none`,
                      py: 1,
                      px: 1,
                      background: theme => theme.palette.neutral.main,
                    }}
                  >

                  </TableCell>

                  {
                    trackFields.map((menu: any, index: number) => {
                      return (
                        <TableCell
                          sx={{
                            width: index == 0 ? `15%` : `auto`,
                            border: `none`,
                            py: 1,
                            px: 1,
                            pl: index == 0 ? 3 : 1,
                            // borderRight:
                            // {
                            //   md: [3, 5].includes(index) ? theme => `solid 1px ${theme.palette.common.white}` : `none`,
                            //   ss: `none`
                            // },
                            [theme.breakpoints.up(1024)]: { borderRight: [3, 5].includes(index) ? `solid 1px ${theme.palette.common.white}` : `none` },
                            [theme.breakpoints.down(1024)]: { borderRight: `none` },
                            background: theme => theme.palette.neutral.main,
                            display: {
                              ss: (menu?.type == visibleTrendFields || menu?.type == null) ? `table-cell` : `none`,
                              md: `table-cell`
                            }
                          }}
                          key={index}
                        >
                          <Stack
                            direction={`row`}
                            alignItems={`center`}
                            justifyContent={
                              index == 0 ? `flex-start` : `center`
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
                                      setSortField(menu?.field);
                                      setSortMode(!sortMode);
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
                                      setSortField(menu?.field);
                                      setSortMode(!sortMode);
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
                                      setSortField(menu?.field);
                                      setSortMode(!sortMode);
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
                      border: `none`,
                      py: 1,
                      px: 1,
                      background: theme => theme.palette.neutral.main,
                    }}
                  >

                  </TableCell>

                  <TableCell
                    sx={{
                      border: `none`,
                      width: `5%`,
                      py: 1,
                      background: theme => theme.palette.neutral.main,
                      [theme.breakpoints.down(1024)]: { display: `none` }
                    }}
                  >

                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                {myTracks.map((track: any, index: number) => (
                  <TableRow
                    key={track?.symbol}
                    sx={{
                      '&:hover': {
                        cursor: `pointer`
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        border: `none`,
                        py: 1,
                        background: theme => theme.palette.neutral.common,
                        [theme.breakpoints.down(1024)]: { display: `none` }
                      }}
                    >

                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                        py: 1,
                        px: 1,
                        background: theme => theme.palette.neutral.common,
                      }}
                      onClick={(e: any) => {
                        e.preventDefault();
                        router.push(`/tracker/nfts/${userName}/${track.symbol}`);
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
                      trackFields.map((field: any, _index: number) => {
                        return (
                          <TableCell
                            align="center"
                            key={_index}
                            sx={{
                              borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                              borderRight: theme => {
                                return {
                                  ss: `none`,
                                  md: [3, 5].includes(_index) ? `solid 1px ${theme.palette.neutral.main}` : `none`,
                                }
                              },
                              py: 1,
                              px: 1,
                              pl: _index == 0 ? 3 : 1,
                              display: {
                                ss: (field?.type == visibleTrendFields || field?.type == null) ? `table-cell` : `none`,
                                md: `table-cell`
                              },
                              background: theme => theme.palette.neutral.common,
                            }}
                            onClick={(e: any) => {
                              e.preventDefault();
                              router.push(`/tracker/nfts/${userName}/${track.symbol}`);
                            }}
                          >

                            <Stack
                              direction={`row`}
                              alignItems={`center`}
                              justifyContent={
                                _index == 0 ? `flex-start` : `center`
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
                                  (field.isStatistic && track[field.field] != undefined && track[field.field] > 0 && field?.field != `listRatio`) ? <GreenUp sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} /> : ``
                                }

                                {
                                  (field.isStatistic && track[field.field] != undefined && track[field.field] < 0 && field?.field != `listRatio`) ? <RedDown sx={{ mr: 0.3, width: `1rem`, height: `1rem` }} /> : ``
                                }

                                <Typography variant={`subtitle2`} color={`inherit`}>
                                  {
                                    (field.isStatistic && track[field.field] != undefined) ? `${numberToFix(parseNumber(track[field.field]) * 100)}%` : ``
                                  }

                                  {
                                    (!field.isStatistic && !field.isLamport && track[field.field] != undefined && isNaN(track[field.field])) ? track[field.field] : ``
                                  }

                                  {
                                    (!field.isStatistic && !field.isLamport && track[field.field] != undefined && !isNaN(parseFloat(track[field.field]))) ? parseInt(track[field.field]) : ``
                                  }

                                  {
                                    (!field.isStatistic && field.isLamport && track[field.field] != undefined) ?
                                      <>
                                        {numberToFix((track[field.field] / LAMPORTS_PER_SOL))}
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
                                      </> : ``
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
                        borderBottom: theme => `solid 2px ${theme.palette.neutral.main}`,
                        py: 1,
                        background: theme => theme.palette.neutral.common,
                      }}
                    >
                      <CloseCancel
                        sx={{
                          width: `1rem`,
                          height: `1rem`,
                          '&:hover': {
                            cursor: `pointer`,
                            opacity: 0.7
                          },
                          color: theme => theme.palette.neutral.main
                        }}
                        onClick={async (event: any) => {
                          event.preventDefault();
                          setDeleteCollection(track?.symbol);
                          setOpenConf(true);
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: `none`,
                        py: 1,
                        [theme.breakpoints.down(1024)]: { display: `none` },
                        background: theme => theme.palette.neutral.common,
                      }}
                    >

                    </TableCell>
                  </TableRow>

                ))}

              </TableBody>

            </Table>
          </InfiniteScroll>
        </TableContainer>
        <Dialog
          open={openConf}
          onClose={closeConfDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to delete this collecion?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={closeConfDialog}><Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.text.primary }} >Cancel</Typography></Button>
            <Button onClick={async () => { await deleteOneCollection() }} autoFocus>
              <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.text.primary }} >Delete</Typography>
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={isShowMessage} autoHideDuration={5000} onClose={closeMessage} sx={{ zIndex: 10001 }}>
          <Alert onClose={closeMessage} severity={messageSeverity} sx={{ width: '100%', zIndex: 10001 }}>
            {messageContent}
          </Alert>
        </Snackbar>

        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </>

  );
}

export default Nfts;
