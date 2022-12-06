import React, { Fragment, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Lazy, Pagination, Navigation } from "swiper";

import {
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';

import { numberToFix } from "src/common/utils/helpers"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE } from "src/common/config";
import ImageWrapper from "src/components/ImageWrapper";

import fetchData from "src/common/services/getDataWithAxios";

import PaperButton from "src/components/PaperButton";

const topMoversField = [
  {
    field: `project`,
    name: `project`
  },
  {
    field: `24h avg`,
    name: `avg`
  },
  {
    field: `change`,
    name: `change`
  },
];

const upcomingField = [
  {
    field: `project`,
    name: `project`
  },
  {
    field: `launchpad`,
    name: `launchpad`
  },
];

const newNftField = [
  {
    field: `project`,
    name: `project`
  },
  {
    field: `date`,
    name: `date`
  },
  {
    field: `time`,
    name: `time`
  },
];

const newTokensField = [
  {
    field: `project`,
    name: `project`
  },
  {
    field: `date`,
    name: `date`
  },
  {
    field: `time`,
    name: `time`
  },
];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const top = () => {
  const router = useRouter();

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

  // For loading
  const [showLoading, setShowLoading] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
      }
      catch (err) {

      }
    })()
  }, [])

  return (
    <>
      <Box
        component={`div`}
        sx={{
          mb: 1,
          position: `relative`
        }}
      >
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            1366: {
              slidesPerView: 4,
              spaceBetween: 36,
            },
            1600: {
              slidesPerView: 5,
              spaceBetween: 48,
            },
          }}
          navigation={true}
          style={{
            "--swiper-navigation-color": "#fff"
          }}
          modules={[Navigation]}
        >
          {
            new Array(12).fill(undefined).map(() => {
              return (
                <SwiperSlide>
                  <Box
                    component={`div`}
                    sx={{
                      width: `100%`,
                      background: theme => theme.palette.background.default,
                      py: 4
                    }}
                  >
                    <ImageWrapper src={`https://beincrypto.com/wp-content/uploads/2019/08/ss_solana.png`} height={`50%`} text={`Okay Bears`} />

                    <Grid
                      container
                      direction={`row`}
                      alignItems={`center`}
                      justifyContent={`center`}
                      sx={{
                        py: 2
                      }}
                    >
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Typography variant={`subtitle2`}>
                          floor
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Typography variant={`subtitle2`}>
                          ligtings
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Typography variant={`subtitle2`}>
                          volume
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      direction={`row`}
                      alignItems={`center`}
                      justifyContent={`center`}
                      sx={{
                        pb: 1
                      }}
                    >
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Typography variant={`h5`}>
                          24.60
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Typography variant={`h5`}>
                          162
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Typography variant={`h5`}>
                          2568
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      direction={`row`}
                      alignItems={`center`}
                      justifyContent={`center`}
                    >
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Stack
                          direction={`row`}
                          alignItems={`center`}
                          justifyContent={`center`}
                        >
                          <ArrowDropUpIcon color={`success`} fontSize={`small`} />
                          <Typography variant={`subtitle2`} >
                            4.69 %
                          </Typography>
                        </Stack>

                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Stack
                          direction={`row`}
                          alignItems={`center`}
                          justifyContent={`center`}
                        >
                          <ArrowDropUpIcon color={`success`} fontSize={`small`} />
                          <Typography variant={`subtitle2`} >
                            5.62 %
                          </Typography>
                        </Stack>

                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sx={{
                          textAlign: `center`
                        }}
                      >
                        <Stack
                          direction={`row`}
                          alignItems={`center`}
                          justifyContent={`center`}
                        >
                          <ArrowDropUpIcon color={`success`} fontSize={`small`} />
                          <Typography variant={`subtitle2`} >
                            1.54 %
                          </Typography>
                        </Stack>

                      </Grid>
                    </Grid>
                  </Box>
                </SwiperSlide>
              )
            })
          }

        </Swiper>

        {/* <Box
          component={`div`}
          sx={{
            position: `absolute`,
            width: `25%`,
            top: 0,
            right: 0,
            bottom: 0,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            background: theme => `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 25%)`,
            zIndex: `10001`
          }}
        >

        </Box> */}
      </Box>

      <Box
        sx={{
          borderTopLeftRadius: 90,
          borderBottomRightRadius: 90,
          background: `none`,
          overflow: `hidden`,
          position: `relative`
        }}
      >
        <Stack
          direction={`row`}
          alignItems={`stretch`}
          justifyContent={`space-between`}
          spacing={1}
        >
          <Box
            component={`div`}
            sx={{
              width: `27%`,
              background: theme => theme.palette.background.default
            }}
          >
            <TableContainer
              component={`div`}
              sx={{
                position: `relative`,
              }}
            >
              <Table
                aria-label="simple table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`,
                  }}
                >
                  <TableRow>
                    <TableCell
                      colSpan={topMoversField.length}
                      sx={{
                        border: `none`,
                        py: 1.5,
                        px: 0,
                        pl: 8
                      }}
                    >
                      <Typography
                        variant={`h5`}

                      >
                        Top Movers
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {
                      topMoversField.map((field: any, index: number) => {
                        return (
                          <TableCell
                            align={index == (topMoversField.length - 1) ? `right` : `left`}
                            sx={{
                              px: 1,
                              pl: index == 0 ? 8 : 1,
                              py: 1,
                              border: `none`
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              {field?.field}
                            </Typography>
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>

                  {
                    new Array(16).fill(undefined).map(() => {
                      return (
                        <TableRow>
                          <TableCell
                            align={`left`}
                            sx={{
                              border: `none`,
                              px: 1,
                              pl: 8,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              Sample project
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`left`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              25
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`right`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              200 %
                            </Typography>
                          </TableCell>

                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            component={`div`}
            sx={{
              width: `23%`,
              background: theme => theme.palette.background.default
            }}
          >
            <TableContainer
              component={`div`}
              sx={{
                position: `relative`,
              }}
            >
              <Table
                aria-label="simple table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`,
                  }}
                >
                  <TableRow>
                    <TableCell
                      colSpan={topMoversField.length}
                      sx={{
                        border: `none`,
                        py: 1.5,
                        px: 2
                      }}
                    >
                      <Typography
                        variant={`h5`}

                      >
                        Upcoming
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {
                      upcomingField.map((field: any, index: number) => {
                        return (
                          <TableCell
                            align={index == (upcomingField.length - 1) ? `right` : `left`}
                            sx={{
                              px: 1,
                              py: 1,
                              border: `none`
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              {field?.field}
                            </Typography>
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>

                  {
                    new Array(6).fill(undefined).map(() => {
                      return (
                        <TableRow>
                          <TableCell
                            align={`left`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              Sample project
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`right`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              Magic Eden
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            component={`div`}
            sx={{
              width: `23%`,
              background: theme => theme.palette.background.default
            }}
          >
            <TableContainer
              component={`div`}
              sx={{
                position: `relative`,
              }}
            >
              <Table
                aria-label="simple table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`,
                  }}
                >
                  <TableRow>
                    <TableCell
                      colSpan={newNftField.length}
                      sx={{
                        border: `none`,
                        py: 1.5,
                        px: 2
                      }}
                    >
                      <Typography
                        variant={`h5`}

                      >
                        New NFT Arrivals
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {
                      newNftField.map((field: any, index: number) => {
                        return (
                          <TableCell
                            align={index == (newNftField.length - 1) ? `right` : `left`}
                            sx={{
                              px: 1,
                              py: 1,
                              border: `none`
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              {field?.field}
                            </Typography>
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>

                  {
                    new Array(6).fill(undefined).map(() => {
                      return (
                        <TableRow>
                          <TableCell
                            align={`left`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              Sample project
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`left`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              12.05.2022
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`right`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              05:25
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            component={`div`}
            sx={{
              width: `27%`,
              background: theme => theme.palette.background.default
            }}
          >
            <TableContainer
              component={`div`}
              sx={{
                position: `relative`
              }}
            >
              <Table
                aria-label="simple table"
              >
                <TableHead
                  sx={{
                    background: theme => `${theme.palette.background.paper}`,
                  }}
                >
                  <TableRow>
                    <TableCell
                      colSpan={newTokensField.length}
                      sx={{
                        border: `none`,
                        py: 1.5,
                        px: 2,
                        pr: 8
                      }}
                    >
                      <Typography
                        variant={`h5`}

                      >
                        New Tokens
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    {
                      newTokensField.map((field: any, index: number) => {
                        return (
                          <TableCell
                            align={index == (newTokensField.length - 1) ? `right` : `left`}
                            sx={{
                              px: 1,
                              py: 1,
                              pr: 8,
                              border: `none`
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              {field?.field}
                            </Typography>
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>

                  {
                    new Array(6).fill(undefined).map(() => {
                      return (
                        <TableRow>
                          <TableCell
                            align={`left`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              Sample project
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`right`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              12.05.2022
                            </Typography>
                          </TableCell>
                          <TableCell
                            align={`right`}
                            sx={{
                              border: `none`,
                              px: 1,
                              py: 1,
                              pr: 8
                            }}
                          >
                            <Typography variant={`subtitle2`} >
                              05:25
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Box>

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
    </>

  )
}

export default top;