import React, { Fragment, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';

import Countdown, { zeroPad, calcTimeDelta, formatTimeDelta } from 'react-countdown';

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

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return (
      <Stack
        direction={`row`}
        alignItems={`flex-start`}
        justifyContent={`center`}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(days)}
          </Typography>
          <Typography variant={`subtitle2`} >
            days
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            :
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(hours)}
          </Typography>
          <Typography variant={`subtitle2`} >
            hours
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            :
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(minutes)}
          </Typography>
          <Typography variant={`subtitle2`} >
            minutes
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            :
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(seconds)}
          </Typography>
          <Typography variant={`subtitle2`} >
            seconds
          </Typography>
        </Stack>
      </Stack>
    );
  } else {
    // Render a countdown
    return (
      <Stack
        direction={`row`}
        alignItems={`flex-start`}
        justifyContent={`center`}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(days)}
          </Typography>
          <Typography variant={`subtitle2`} >
            days
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            :
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(hours)}
          </Typography>
          <Typography variant={`subtitle2`} >
            hours
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            :
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(minutes)}
          </Typography>
          <Typography variant={`subtitle2`} >
            minutes
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            :
          </Typography>
        </Stack>

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant={`h3`} >
            {zeroPad(seconds)}
          </Typography>
          <Typography variant={`subtitle2`} >
            seconds
          </Typography>
        </Stack>
      </Stack>
    );
  }
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const raffle = () => {
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
    <Box
      component={`div`}
      sx={{
        py: 8
      }}
    >
      <Box
        sx={{
          width: `64%`,
          borderTopLeftRadius: 45,
          borderBottomRightRadius: 45,
          background: `none`,
          overflow: `hidden`,
          position: `relative`,
          mx: `auto`
        }}
      >
        <Stack
          direction={`row`}
          alignItems={`stretch`}
          justifyContent={`space-between`}
          spacing={1}
        >
          <Stack
            direction={`column`}
            alignItems={`stretch`}
            justifyContent={`space-between`}
            sx={{
              width: `44%`,
              background: theme => theme.palette.background.default
            }}
          >
            <Box
              sx={{
                py: 1.5,
                px: 6,
                background: theme => theme.palette.background.paper
              }}
            >
              <Typography variant={`h5`}>
                Current Raffle
              </Typography>
            </Box>

            <Box
              component={`div`}
              sx={{
                p: 4
              }}
            >
              <Typography variant={`subtitle2`} sx={{ mb: 2 }}>
                800 Solana worth of NFT’s, Including but not limited to projects such as Cets on crack, OG Atadians, Famous foxes and more.
              </Typography>
              <Typography variant={`subtitle2`} sx={{ mb: 2 }}>
                NUMBER HERE lucky winners will be chosen out of the participants on DATE HERE.
              </Typography>
              <Typography variant={`subtitle2`} sx={{ mb: 2 }}>
                ABOUT TWO LINES OF INFO ABOUT REDEEMING WINNINGS HERE.
              </Typography>
            </Box>

            <Stack
              direction={`column`}
              justifyContent={`space-between`}
              alignItems={`stretch`}
              sx={{
                p: 4
              }}
            >
              <Stack
                direction={`column`}
                justifyContent={`center`}
                alignItems={`center`}
                component={`div`}
                sx={{
                  mt: 4
                }}
              >
                <Typography variant={`h5`} sx={{ mb: 2 }} align={`center`}>
                  Time Remaining
                </Typography>

                <Countdown
                  date={Date.now() + 5000}
                  renderer={renderer}
                />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction={`column`}
            justifyContent={`space-between`}
            alignItems={`space-between`}
            sx={{
              p: 4,
              background: theme => theme.palette.background.default
            }}
          >
            <ImageWrapper src={`https://beincrypto.com/wp-content/uploads/2019/08/ss_solana.png`} height={`50%`} text={`Okay Bears`} />

            <Grid
              container
              direction={`row`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={2}
            >
              <Grid
                item
                lg={6}
              >
                <Typography variant={`h5`}>
                  Ticket Amount
                </Typography>

                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={``}
                  size={`small`}
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: `none`,
                    '& .MuiInputBase-input': {
                      py: 0.5
                    },
                  }}
                />
              </Grid>

              <Grid
                item
                lg={6}
              >
                <Typography variant={`h5`}>
                  Total Cost
                </Typography>

                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={``}
                  size={`small`}
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: `none`,
                    '& .MuiInputBase-input': {
                      py: 0.5
                    },
                  }}
                />
              </Grid>

              <Grid
                item
                lg={6}
              >
                <Typography variant={`h5`}>
                  Discord ID
                </Typography>

                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={``}
                  size={`small`}
                  sx={{
                    background: theme => theme.palette.background.paper,
                    border: `none`,
                    '& .MuiInputBase-input': {
                      py: 0.5
                    },
                  }}
                />
              </Grid>

              <Grid
                item
                lg={6}
              >
                <PaperButton
                  selected={true}
                  sx={{
                    width: `100%`,
                    height: `100%`,
                    borderBottomRightRadius: `45px !important`
                  }}
                >
                  <Typography
                    variant={`subtitle2`}
                    sx={{
                      color: theme => (true ? theme.palette.common.white : theme.palette.common.black)
                    }}
                  >
                    Purchase
                  </Typography>
                </PaperButton>
              </Grid>

            </Grid>
          </Stack>

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
    </Box>

  )
}

export default raffle;