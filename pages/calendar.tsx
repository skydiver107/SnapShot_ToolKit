import React, { Fragment, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router'



import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import ButtonGroup from '@mui/material/ButtonGroup';
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';



import { numberToFix } from "src/common/utils/helpers"
import { DATA_API, LIMIT_COLUMNS, TIME_RANGE, CALENDAR } from "src/common/config";

import fetchData from "src/common/services/getDataWithAxios";
import PageInfo from "src/components/PageContainer/PageInfo"
import PaperButton from "src/components/PaperButton";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const calendar = () => {
  const router = useRouter();

  // For Ticker mode
  const [tickerMode, setTickerMode] = useState<string[]>([]);

  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);
  const calendarLists = [
    { title: 'Mints', selected: true },
    { title: 'Auctions', selected: false },
    { title: 'Personal', selected: false }
  ]
  const [calendarList, setCalendarList] = useState(0)
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
    <Box
      sx={{
        borderTopLeftRadius: 90,
        borderBottomRightRadius: 90,
        mx: `auto`,
        background: `none`,
        overflow: `hidden`
      }}
    >
      <Stack
        direction={`column`}
        alignItems={`stretch`}
        justifyContent={`space-between`}
        spacing={1}
      >
        <PageInfo>
          <ButtonGroup
          >
            {
              calendarLists.map((item: any, idx: any) => {
                return (
                  <Box sx={{
                    background: theme => idx == calendarList ? theme.palette.neutral.main : theme.palette.background.paper,
                    px: 2,
                    py: 1.5,
                    borderRadius: idx == 0 ? '4px 0px 0px 4px' : idx == 2 ? '0px 4px 4px 0px' : ''
                  }}
                    onClick={() => setCalendarList(idx)}

                  >
                    <Typography variant='subtitle2'>{item.title}</Typography>
                  </Box>

                )
              })
            }
          </ButtonGroup>
        </PageInfo>

        <Stack
          direction={`row`}
          alignItems={`stretch`}
          justifyContent={`space-between`}
          spacing={1}
          sx={{
            width: {
              lg: `92%`,
              xl: `92%`
            },
            margin: '8px auto !important'
          }}
        >
          <Stack
            direction={`row`}
            alignItems={`center`}
            justifyContent={`center`}
            sx={{
              width: `68%`,
              position: `relative`
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
                  borderCollapse: `collapse`
                }}
              >
                <TableBody>
                  <TableRow>
                    {
                      CALENDAR.weekDays.map((day: string, index: number) => {
                        return (
                          <TableCell
                            key={index}
                            align="center"
                            sx={{
                              background: `none`,
                              px: 0,
                              py: 0,
                              pb: 1,
                              border: `none`
                            }}
                          >
                            <Box
                              sx={{
                                display: `flex`,
                                alignItems: `center`,
                                justifyContent: `center`,
                                px: 2,
                                py: 1.5,
                                background: theme => theme.palette.background.paper
                              }}
                            >
                              <Typography variant={`subtitle2`} color={`inherit`}>
                                {day}
                              </Typography>
                            </Box>
                          </TableCell>
                        )
                      })
                    }

                  </TableRow>

                  {
                    new Array(CALENDAR.weeksCount).fill(undefined).map((cnt: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          {
                            CALENDAR.weekDays.map((day: string, _index: number) => {
                              return (
                                <TableCell
                                  key={_index}
                                  align="left"
                                  sx={{
                                    background: theme => theme.palette.background.default,
                                    px: 1,
                                    py: 0.5,
                                    border: theme => `solid ${theme.palette.neutral.main} 1px`
                                  }}
                                >
                                  <Box
                                    sx={{
                                      minHeight: `20vh`,
                                      maxHeight: `20vh`,
                                      overflow: `auto`
                                    }}
                                  >
                                    <Typography variant={`subtitle2`}>
                                      {_index + 1}
                                    </Typography>

                                    {
                                      index == 0 && new Array(3).fill(undefined).map((tem: any, __index: number) => {
                                        return (
                                          <Typography variant={`subtitle2`} key={__index}>
                                            &#8226; Sample event
                                          </Typography>
                                        )
                                      })
                                    }

                                    <Typography variant={`subtitle2`}>
                                      &#43;2 more events
                                    </Typography>
                                  </Box>

                                </TableCell>
                              )
                            })
                          }
                        </TableRow>
                      )

                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>

          <Box
            sx={{
              width: `32%`,
              background: theme => theme.palette.background.default,
              position: `relative`
            }}
          >
            {new Array(3).fill(undefined).map((item: any, index: number) => {
              return (
                <Box
                  sx={{
                    p: 2,
                    borderBottom: index == 2 ? `none` : theme => `solid ${theme.palette.background.paper} 4px`
                  }}
                >
                  <Stack
                    component={`div`}
                    direction={`row`}
                    alignItems={`center`}
                    justifyContent={`space-between`}
                  >
                    <Typography variant={`h5`}>Sample Event 1</Typography>
                    <Typography variant={`h5`}>08:15</Typography>
                  </Stack>

                  <Typography variant={`subtitle2`} sx={{ pl: 4 }}>
                    The last event will not need a spacer block below it,<br></br>
                    but it can also extend downloads
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Stack>

      </Stack>

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
    </Box >
  )
}

export default calendar;