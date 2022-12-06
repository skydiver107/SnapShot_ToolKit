import React, { Fragment, useEffect, useRef, useState } from "react";

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import moment from 'moment';

import * as anchor from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
// import {
//   WalletDialogButton,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-material-ui";

import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css'); // Default styles that can be overridden by your app

import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Popover from '@mui/material/Popover';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Skeleton from '@mui/material/Skeleton';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import RedDown from 'src/components/IconButton/RedDown';
import GreenUp from 'src/components/IconButton/GreenUp';
import PageInfo from "src/components/PageContainer/PageInfo";
import { Alert, AlertColor, Avatar, Backdrop, Button, CircularProgress, Snackbar, Stack, TableHead, TextField } from "@mui/material";
import fetchData from "src/common/services/getDataWithAxios";

import { numberToFix } from "src/common/utils/helpers";
import { handleImageError } from "src/common/utils/handleImageError";
import { DATA_API, TIME_RANGE, LIMIT_COLUMNS, TIME_INCREASE, HYPERSPACE_UPCOMING_URL, LAUNCHPAD_CONFIG, SIGN_KEY } from "src/common/config";
import AddPlus from "@components/IconButton/AddPlus";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import CloseCancel from "@components/IconButton/CloseCancel";
import { validURL } from "src/common/utils/validURL";

interface WhiteWallet {
  name: string,
  address: string
}

interface WhiteNft {
  name: string,
  address: string
}

interface AdminWallet {
  address: string,
  role: number,
  name: string
}

const Home = () => {
  const router = useRouter();

  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isAuthing, setIsAuthing] = React.useState(true);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(-1);
  const [supply, setSupply] = useState<number>(-1);
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [launchTime, setLaunchTime] = useState<string>("");
  const [launchDate, setLaunchDate] = useState<string>("");

  const [deleteWhiteMode, setDeleteWhiteMode] = useState<string>(``);

  const [timer, setTimer] = React.useState<number>(0);

  const [futures, setFutures] = React.useState<any[] | null>(null);
  const [pasts, setPasts] = React.useState<any[] | null>(null);

  const [whiteWallets, setWhiteWallets] = React.useState<WhiteWallet[] | null>(null);
  const [whiteNfts, setWhiteNfts] = React.useState<WhiteNft[] | null>(null);
  const [adminWallets, setAdminWallets] = React.useState<AdminWallet[] | null>(null);

  const [whiteWalletName, setWhiteWalletName] = React.useState<string>(``);
  const [whiteWalletAddress, setWhiteWalletAddress] = React.useState<string>(``);

  const [whiteNftName, setWhiteNftName] = React.useState<string>(``);
  const [whiteNftAddress, setWhiteNftAddress] = React.useState<string>(``);

  const [adminWalletName, setAdminWalletName] = React.useState<string>(``);
  const [adminWalletAddress, setAdminWalletAddress] = React.useState<string>(``);

  const [deleteWhiteWalletAddress, setDeleteWhiteWalletAddress] = React.useState<string>(``);
  const [deleteWhiteNftAddress, setDeleteWhiteNftAddress] = React.useState<string>(``);
  const [deleteAdminWalletAddress, setDeleteAdminWalletAddress] = React.useState<string>(``);

  const [mode, setMode] = React.useState<string>(`future`);
  const [open, setOpen] = React.useState<boolean>(false);

  const [showLoading, setShowLoading] = React.useState<boolean>(false);
  // For alert message
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>(``);
  const [messageSeverity, setMessageSeverity] = useState<AlertColor>(`success`);

  // For delete Collection
  const [deleteLaunchpad, setDeleteLaunchpad] = useState<string>(``);

  // For Popover
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const openPop = Boolean(anchorEl);

  const [poperData, setPoperData] = useState<string>(``);

  const [openConf, setOpenConf] = useState<boolean>(false);
  // For Handle Alert Modal
  const closeConfDialog = () => {
    setOpenConf(false);
  }
  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageContent(``);
    setMessageSeverity(`success`)
    setIsShowMessage(false);
  };

  React.useEffect(() => {
    (async () => {
      if (!anchorWallet?.publicKey?.toString()) {
        setIsShowMessage(true);
        setMessageContent(`You are not allowed to access.`);
        setMessageSeverity(`error`);
        router.push({
          pathname: '/home'
        });
      }
      else {
        try {
          if (router.isReady && anchorWallet?.publicKey?.toString()) {
            const checkAdmin = await fetchData({
              method: `post`,
              route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.CHECK_ADMIN}`,
              data: {
                wallet: anchorWallet?.publicKey?.toString()
              }
            });
            if (checkAdmin) {
              setIsAdmin(true);
              setIsAuthing(false)
            }
            else {
              setIsShowMessage(true);
              setMessageContent(`You are not allowed to access.`);
              setMessageSeverity(`error`);
              router.push({
                pathname: '/home'
              });
            }
          }
          else {
            setIsShowMessage(true);
            setMessageContent(`You are not allowed to access.`);
            setMessageSeverity(`error`);
            router.push({
              pathname: '/home'
            });
          }
        }
        catch (err) {
          setIsShowMessage(true);
          setMessageContent(`You are not allowed to access.`);
          setMessageSeverity(`error`);
          router.push({
            pathname: '/home'
          });
        }
        finally {
        }
      }

    })()
  }, [router.isReady, anchorWallet]);

  useEffect(() => {
    (async () => {
      try {
        if (router.isReady) {
          fetchLaunchpads();
          let tickerInterval = await startTimeInterval();
          return () => clearInterval(tickerInterval);
        }
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [router.isReady]);

  useEffect(() => {
    (async () => {
      try {
        if (timer > 0) {
          fetchLaunchpads();
        }
      }
      catch (err) {

      }
      finally {

      }
    })()
  }, [timer]);

  useEffect(() => {
    (async () => {
      try {
        if (router.isReady) {
          const whiteData = await Promise.all([
            fetchData({
              method: `get`,
              route: `${DATA_API.WHITEWALLET_API.COMMON}${DATA_API.WHITEWALLET_API.GET_WALLETS}`
            }),
            fetchData({
              method: `get`,
              route: `${DATA_API.WHITENFT_API.COMMON}${DATA_API.WHITENFT_API.GET_NFTS}`
            }),
            fetchData({
              method: `get`,
              route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.GET_WALLETS}`
            })
          ]);
          if (whiteData[0] && Array.isArray(whiteData[0])) {
            setWhiteWallets([...whiteData[0]]);
          }

          if (whiteData[1] && Array.isArray(whiteData[1])) {
            setWhiteNfts([...whiteData[1]]);
          }

          if (whiteData[2] && Array.isArray(whiteData[2])) {
            setAdminWallets([...whiteData[2]]);
          }
        }
      }
      catch (err) {
        console.log(`getting white data err:`, err);
      }
      finally {

      }
    })()
  }, [router.isReady]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addWhiteWallet = async () => {
    if (!whiteWalletName) {
      setIsShowMessage(true);
      setMessageContent(`Please input wallet name.`);
      setMessageSeverity(`warning`);
      return;
    }

    if (!whiteWalletAddress) {
      setIsShowMessage(true);
      setMessageContent(`Please input wallet address.`);
      setMessageSeverity(`warning`);
      return;
    }

    try {
      if (!web3.PublicKey.isOnCurve(new web3.PublicKey(whiteWalletAddress))) {
        setIsShowMessage(true);
        setMessageContent(`Please input wallet address correctly.`);
        setMessageSeverity(`warning`);
        return;
      }
    }
    catch {
      setIsShowMessage(true);
      setMessageContent(`Please input wallet address correctly.`);
      setMessageSeverity(`warning`);
      return;
    }

    const isDuplicated = whiteWallets.find((wallet: WhiteWallet) => {
      return wallet.address == whiteWalletAddress;
    });
    if (isDuplicated) {
      setIsShowMessage(true);
      setMessageContent(`The wallet already exists. Please input another.`);
      setMessageSeverity(`warning`);
      return;
    }

    setShowLoading(true);
    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);

      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WHITEWALLET_API.COMMON}${DATA_API.WHITEWALLET_API.ADD_WALLET}`,
        data: {
          wallet: whiteWalletAddress,
          address: wallet?.publicKey?.toString(),
          name: whiteWalletName,
          signature: decodedSignature
        }
      });

      if (result == true) {
        setIsShowMessage(true);
        setMessageContent(`The wallet was successfully added.`);
        setMessageSeverity(`success`);
        setWhiteWalletAddress(``);
        setWhiteWalletName(``);
        setWhiteWallets([...whiteWallets, { name: whiteWalletName, address: whiteWalletAddress }]);
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`The wallet was not added. Please try again.`);
        setMessageSeverity(`error`);
      }
    }
    catch (err) {
      setIsShowMessage(true);
      setMessageContent('The request was failed. Please try again.');
      setMessageSeverity(`error`);
    }

    setShowLoading(false);
  }

  const deleteWhiteWallet = async (address: string) => {
    setShowLoading(true);
    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);

      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WHITEWALLET_API.COMMON}${DATA_API.WHITEWALLET_API.DELETE_WALLET}`,
        data: {
          address: wallet?.publicKey?.toString(),
          wallet: address,
          signature: decodedSignature
        }
      });

      if (result == true) {
        setIsShowMessage(true);
        setMessageContent(`The wallet was successfully deleted.`);
        setMessageSeverity(`success`);

        const removed = whiteWallets.filter((wallet: WhiteWallet) => {
          return wallet.address != address;
        });
        setWhiteWallets([...removed]);
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`The wallet was not added. Please try again.`);
        setMessageSeverity(`error`);
      }
    }
    catch (err) {
      setIsShowMessage(true);
      setMessageContent('The request was failed. Please try again.');
      setMessageSeverity(`error`);
    }

    setShowLoading(false);
    handleClose();
  }

  const addWhiteNft = async () => {
    if (!whiteNftName) {
      setIsShowMessage(true);
      setMessageContent(`Please input collection name.`);
      setMessageSeverity(`warning`);
      return;
    }

    if (!whiteNftAddress) {
      setIsShowMessage(true);
      setMessageContent(`Please input nft address.`);
      setMessageSeverity(`warning`);
      return;
    }

    let newWhiteNftAddress = whiteNftAddress.replace(/\s+/g, ',').replace(/\n/g, ',');

    // const isDuplicated = whiteNfts.find((nft: WhiteNft) => {
    //   return nft.address == whiteNftAddress;
    // });
    // if (isDuplicated) {
    //   setIsShowMessage(true);
    //   setMessageContent(`The nft already exists. Please input another.`);
    //   setMessageSeverity(`warning`);
    //   return;
    // }

    setShowLoading(true);
    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);

      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WHITENFT_API.COMMON}${DATA_API.WHITENFT_API.ADD_NFT}`,
        data: {
          nft: newWhiteNftAddress,
          address: wallet?.publicKey?.toString(),
          name: whiteNftName,
          signature: decodedSignature
        }
      });

      if (result == true) {
        setIsShowMessage(true);
        setMessageContent(`The nft was successfully added.`);
        setMessageSeverity(`success`);
        setWhiteNftAddress(``);
        setWhiteNftName(``);
        setWhiteNfts([...whiteNfts, { name: whiteNftName, address: whiteNftAddress }]);
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`The nft was not added. Please try again.`);
        setMessageSeverity(`error`);
      }
    }
    catch (err) {
      setIsShowMessage(true);
      setMessageContent('The request was failed. Please try again.');
      setMessageSeverity(`error`);
    }

    setShowLoading(false);
  }

  const deleteWhiteNft = async (address: string) => {
    setShowLoading(true);
    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);

      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WHITENFT_API.COMMON}${DATA_API.WHITENFT_API.DELETE_NFT}`,
        data: {
          address: wallet?.publicKey?.toString(),
          wallet: address,
          signature: decodedSignature
        }
      });

      if (result == true) {
        setIsShowMessage(true);
        setMessageContent(`The nft was successfully deleted.`);
        setMessageSeverity(`success`);

        const removed = whiteNfts.filter((nnft: WhiteNft) => {
          return nnft.address != address;
        });
        setWhiteNfts([...removed]);
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`The nft was not deleted. Please try again.`);
        setMessageSeverity(`error`);
      }
    }
    catch (err) {
      setIsShowMessage(true);
      setMessageContent('The request was failed. Please try again.');
      setMessageSeverity(`error`);
    }

    setShowLoading(false);
    handleClose();
  }

  const addAdminWallet = async () => {
    if (!adminWalletName) {
      setIsShowMessage(true);
      setMessageContent(`Please input admin wallet name.`);
      setMessageSeverity(`warning`);
      return;
    }

    if (!adminWalletAddress) {
      setIsShowMessage(true);
      setMessageContent(`Please input admin wallet address.`);
      setMessageSeverity(`warning`);
      return;
    }

    try {
      if (!web3.PublicKey.isOnCurve(new web3.PublicKey(adminWalletAddress))) {
        setIsShowMessage(true);
        setMessageContent(`Please input admin wallet address correctly.`);
        setMessageSeverity(`warning`);
        return;
      }
    }
    catch {
      setIsShowMessage(true);
      setMessageContent(`Please input admin wallet address correctly.`);
      setMessageSeverity(`warning`);
      return;
    }

    const isDuplicated = adminWallets.find((admin: AdminWallet) => {
      return admin.address == adminWalletAddress;
    });
    if (isDuplicated) {
      setIsShowMessage(true);
      setMessageContent(`The admin wallet already exists. Please input another.`);
      setMessageSeverity(`warning`);
      return;
    }

    setShowLoading(true);
    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);

      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.ADD_WALLET}`,
        data: {
          wallet: adminWalletAddress,
          address: wallet?.publicKey?.toString(),
          name: adminWalletName,
          signature: decodedSignature
        }
      });

      if (result == true) {
        setIsShowMessage(true);
        setMessageContent(`The admin wallet was successfully added.`);
        setMessageSeverity(`success`);
        setAdminWalletAddress(``);
        setAdminWalletName(``);
        setAdminWallets([...adminWallets, { name: adminWalletName, address: adminWalletAddress, role: 2 }]);
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`The admin wallet was not added. Please try again.`);
        setMessageSeverity(`error`);
      }
    }
    catch (err) {
      setIsShowMessage(true);
      setMessageContent('The request was failed. Please try again.');
      setMessageSeverity(`error`);
    }

    setShowLoading(false);
  }

  const deleteAdminWallet = async (address: string) => {
    setShowLoading(true);
    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);

      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.DELETE_WALLET}`,
        data: {
          address: wallet?.publicKey?.toString(),
          wallet: address,
          signature: decodedSignature
        }
      });

      if (result == true) {
        setIsShowMessage(true);
        setMessageContent(`The admin wallet was successfully deleted.`);
        setMessageSeverity(`success`);

        const removed = adminWallets.filter((admin: AdminWallet) => {
          return admin.address != address;
        });
        setAdminWallets([...removed]);
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`The admin wallet was not deleted. Please try again.`);
        setMessageSeverity(`error`);
      }
    }
    catch (err) {
      setIsShowMessage(true);
      setMessageContent('The request was failed. Please try again.');
      setMessageSeverity(`error`);
    }

    setShowLoading(false);
    handleClose();
  }

  const fetchLaunchpads = async () => {
    new Promise((myResolve, myReject) => {
      try {
        const futureCollections: any = fetchData({
          method: `get`,
          route: `${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.GET_LAUNCHPAD}?mode=future`
        });

        myResolve(futureCollections);
      }
      catch {
        myResolve(null);
      }
    }).then(async (res) => {
      if (res) {
        const result: any = res;
        if (result && Array.isArray(result)) {
          setFutures([...result]);
        }
        else {
          setFutures([]);
        }
      }
      else {
        setFutures([]);
      }
    });

    new Promise((myResolve, myReject) => {
      try {
        const futureCollections: any = fetchData({
          method: `get`,
          route: `${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.GET_LAUNCHPAD}?mode=past`
        });

        myResolve(futureCollections);
      }
      catch {
        myResolve(null);
      }
    }).then(async (res) => {
      if (res) {
        const result: any = res;
        if (result && Array.isArray(result)) {
          setPasts([...result]);
        }
        else {
          setPasts([]);
        }
      }
      else {
        setFutures([]);
      }
    });
  }

  const getLaunchpads = async (mode: string) => {
    try {
      const launchpads: any = await fetchData({
        method: `get`,
        route: `${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.GET_LAUNCHPAD}?mode=${mode}`
      });

      if (launchpads && Array.isArray(launchpads)) {
        if (mode == `future`) {
          setFutures([...launchpads])
        }
        else {
          setPasts([...launchpads])
        }
      }
    }
    catch (err) {
      console.log(`err`, err);
    }
  }

  const startTimeInterval = async () => {
    const intervalId = window.setInterval(async () => {
      setTimer(timer => timer + TIME_INCREASE);
    }, TIME_RANGE * 6)
    return intervalId;
  }

  const removeLaunchpad = async () => {
    if (deleteLaunchpad) {
      setShowLoading(true);

      if (anchorWallet?.publicKey?.toString()) {
        try {
          const result: any = await fetchData({
            method: `post`,
            route: `${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.DELETE_LAUNCHPAD}`,
            data: {
              wallet: anchorWallet?.publicKey?.toString(),
              symbol: deleteLaunchpad
            }
          });

          if (result) {
            await getLaunchpads(mode);

            setIsShowMessage(true);
            setMessageContent(`One launchpad was deleted.`);
            setMessageSeverity(`info`);
          }
          else {
            setIsShowMessage(true);
            setMessageContent(`Deleting launchpad was failed, please try again later.`);
            setMessageSeverity(`error`)
          }
        }
        catch {
          setIsShowMessage(true);
          setMessageContent(`Deleting launchpad was failed, please try again later.`);
          setMessageSeverity(`error`);
        }
        finally {
          setOpenConf(false);
          setShowLoading(false);
        }
      }
      else {
        setIsShowMessage(true);
        setMessageContent(`Wallet not connected!`);
        setMessageSeverity(`warning`);
        setShowLoading(false);
      }
    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Please select for launchpad.`);
      setMessageSeverity(`warning`);
      setShowLoading(false);
    }
  }

  const addLaunchpad = async () => {
    if (!name) {
      setIsShowMessage(true);
      setMessageContent(`Please input collection name`);
      setMessageSeverity(`warning`);
      return;
    }

    if (price < 0) {
      setIsShowMessage(true);
      setMessageContent(`Please input price correctly`);
      setMessageSeverity(`warning`);
      return;
    }

    if (supply < 0) {
      setIsShowMessage(true);
      setMessageContent(`Please input supply correctly`);
      setMessageSeverity(`warning`);
      return;
    }

    if (link && !validURL(link)) {
      setIsShowMessage(true);
      setMessageContent(`Please input link url correctly`);
      setMessageSeverity(`warning`)
      return;
    }

    if (!launchDate) {
      setIsShowMessage(true);
      setMessageContent(`Please input launch date correctly`);
      setMessageSeverity(`warning`)
      return;
    }

    if (!launchTime) {
      setIsShowMessage(true);
      setMessageContent(`Please input launch time correctly`);
      setMessageSeverity(`warning`)
      return;
    }

    if (anchorWallet?.publicKey?.toString()) {
      setShowLoading(true);
      try {
        const result: any = await fetchData({
          method: `post`,
          route: `${DATA_API.LAUNCHPAD_API.COMMON}${DATA_API.LAUNCHPAD_API.ADD_LAUNCHPAD}`,
          data: {
            wallet: anchorWallet?.publicKey?.toString(),
            name,
            price,
            supply,
            link,
            image,
            launchTime,
            launchDate
          }
        });

        setMessageSeverity(`error`);
        switch (result) {
          case LAUNCHPAD_CONFIG.NET_ERROR:
            setMessageContent(`Network error. Please check your conenction.`);
            setIsShowMessage(true);
            break;
          case LAUNCHPAD_CONFIG.DB_ERROR:
            setMessageContent(`Database error. please try again later.`);
            setIsShowMessage(true);
            break;
          case LAUNCHPAD_CONFIG.NO_ADMIN_WALLET:
            setMessageContent(`You are not allowed.`);
            setIsShowMessage(true);
            break;
          case LAUNCHPAD_CONFIG.DUPLICATED_COLLECTION:
            setMessageContent(`Collection is exist. Please choose another collection name.`);
            setIsShowMessage(true);
            break;
          case LAUNCHPAD_CONFIG.SUCCESS:
            await getLaunchpads(`future`);
            await getLaunchpads(`past`);
            setMessageContent(`The launchpad was added.`);
            setMessageSeverity(`success`);
            setIsShowMessage(true);
            break;
          default:
            setMessageContent(`Inserting launchpad was failed, please try again later.`);
            setIsShowMessage(true);
            break;
        }
      }
      catch {
        setIsShowMessage(true);
        setMessageContent(`Inserting launchpad was failed, please try again later.`);
        setMessageSeverity(`error`);
      }
      finally {
        setShowLoading(false);
      }

    }
    else {
      setIsShowMessage(true);
      setMessageContent(`Wallet not connected!`);
      setMessageSeverity(`warning`);
    }
  }

  return (
    <Box
      component={`main`}
      sx={{ overflow: 'hidden' }}
    >
      <PageInfo>

      </PageInfo>

      {
        !isAuthing ?
          <>
            <Box component='section'
              sx={{
                px: {
                  md: 13,
                  ss: 2,
                  xs: 6,
                  sm: 8
                },
                py: 3,
              }}
            >
              <Typography variant="h6" sx={{ color: theme => theme.palette.common.white }}>
                Access Configuration
              </Typography>
            </Box>
            <Grid
              container
              direction={`row`}
              alignItems={`stretch`}
              spacing={2}
              sx={{
                px: {
                  md: 13,
                  ss: 2,
                  xs: 6,
                  sm: 8
                }
              }}
            >
              <Grid item ss={12} sm={6} lg={4}>
                <TableContainer
                  sx={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    background: theme => theme.palette.neutral.common
                  }}
                >
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
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main,
                          }}>

                        </TableCell>

                        <TableCell sx={{
                          background: theme => theme.palette.neutral.main,
                          border: 'none',
                          p: 2
                        }} >
                          <Typography variant='h6'>
                            Wallet Whitelists
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={whiteWalletName}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`new wallet nickname`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setWhiteWalletName(event?.target?.value);
                            }}
                          />
                        </TableCell>

                        <TableCell
                          colSpan={2}
                          rowSpan={2}
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <AddPlus
                            sx={{
                              width: `1.75rem`,
                              height: `1.75rem`,
                              '&:hover': {
                                cursor: `pointer !important`,
                                opacity: 0.7
                              },
                              color: `white`
                            }}
                            onClick={async () => {
                              await addWhiteWallet();
                            }}
                          />
                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 1,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={whiteWalletAddress}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`new wallet address`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setWhiteWalletAddress(event.target.value)
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {
                        whiteWallets == null ? (
                          new Array(10).fill(undefined).map((item: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 2,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                  <Stack
                                    component={`div`}
                                    direction={`row`}
                                    alignItems={`center`}
                                  >
                                    <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>
                                  </Stack>
                                  <Typography variant={`subtitle2`} sx={{ mt: 1 }}>
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>

                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
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
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) :
                          (
                            whiteWallets.map((whiteWallet: WhiteWallet, index: number) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 2,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                    <Typography variant={`subtitle1`} sx={{ mb: 1 }}>
                                      {whiteWallet.name}
                                    </Typography>
                                    <Stack
                                      component={`div`}
                                      direction={`row`}
                                      alignItems={`center`}
                                    >
                                      <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright, width: `100%`, textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap` }}>
                                        {whiteWallet.address.substring(0, Math.floor(whiteWallet.address.length * 3 / 4))}...
                                      </Typography>

                                    </Stack>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
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
                                      onClick={() => {
                                        setOpen(true);
                                        setDeleteWhiteMode(`wallet`);
                                        setDeleteWhiteWalletAddress(whiteWallet.address);
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
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

              <Grid item ss={12} sm={6} lg={4}>
                <TableContainer
                  sx={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    background: theme => theme.palette.neutral.common
                  }}
                >
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
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main,
                          }}>

                        </TableCell>

                        <TableCell sx={{
                          background: theme => theme.palette.neutral.main,
                          border: 'none',
                          p: 2
                        }} >
                          <Typography variant='h6'>
                            NFT Whitelists
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={whiteNftName}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`new collection nickname`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setWhiteNftName(event.target.value);
                            }}
                          />
                        </TableCell>

                        <TableCell
                          colSpan={2}
                          rowSpan={2}
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <AddPlus
                            sx={{
                              width: `1.75rem`,
                              height: `1.75rem`,
                              '&:hover': {
                                cursor: `pointer !important`,
                                opacity: 0.7
                              },
                              color: `white`
                            }}
                            onClick={async () => {
                              await addWhiteNft()
                            }}
                          />
                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 1,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            multiline
                            minRows={5}
                            value={whiteNftAddress}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& textarea': {
                                fontSize: `0.75rem`,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`new collection creator address`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setWhiteNftAddress(event.target.value);
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {
                        whiteNfts == null ? (
                          new Array(10).fill(undefined).map((item: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 2,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                  <Stack
                                    component={`div`}
                                    direction={`row`}
                                    alignItems={`center`}
                                  >
                                    <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>
                                  </Stack>
                                  <Typography variant={`subtitle2`} sx={{ mt: 1 }}>
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
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
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) :
                          (
                            whiteNfts.map((nft: WhiteNft, index: number) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 2,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                    <Typography
                                      variant={`subtitle1`}
                                      sx={{ mb: 1 }}
                                    >
                                      {nft.name}
                                    </Typography>
                                    <Stack
                                      component={`div`}
                                      direction={`row`}
                                      alignItems={`center`}
                                    >
                                      <Typography
                                        variant={`subtitle2`}
                                        sx={{
                                          color: theme => theme.palette.neutral.bright,
                                          width: `100%`, textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap`
                                        }}
                                        onMouseEnter={
                                          (event: React.MouseEvent<HTMLElement>) => {
                                            setPoperData(nft.address);
                                            handlePopoverOpen(event);
                                          }
                                        }
                                        onMouseLeave={
                                          (event: React.MouseEvent<HTMLElement>) => {
                                            handlePopoverClose();
                                          }
                                        }
                                      >
                                        {nft.address.substring(0, 36)}...
                                      </Typography>

                                    </Stack>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
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
                                      onClick={() => {
                                        setOpen(true);
                                        setDeleteWhiteMode(`nft`);
                                        setDeleteWhiteNftAddress(nft.address);
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
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

              <Grid item ss={12} sm={6} lg={4}>
                <TableContainer
                  sx={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    background: theme => theme.palette.neutral.common
                  }}
                >
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
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main,
                          }}>

                        </TableCell>

                        <TableCell sx={{
                          background: theme => theme.palette.neutral.main,
                          border: 'none',
                          p: 2
                        }} >
                          <Typography variant='h6'>
                            Admin Wallets
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={adminWalletName}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`new admin name`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setAdminWalletName(event?.target?.value);
                            }}
                          />
                        </TableCell>

                        <TableCell
                          colSpan={2}
                          rowSpan={2}
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <AddPlus
                            sx={{
                              width: `1.75rem`,
                              height: `1.75rem`,
                              '&:hover': {
                                cursor: `pointer !important`,
                                opacity: 0.7
                              },
                              color: `white`
                            }}
                            onClick={async () => {
                              await addAdminWallet();
                            }}
                          />
                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 1,
                            background: theme => theme.palette.neutral.common
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={adminWalletAddress}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`new admin address`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setAdminWalletAddress(event.target.value)
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {
                        adminWallets == null ? (
                          new Array(10).fill(undefined).map((item: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 2,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                  <Stack
                                    component={`div`}
                                    direction={`row`}
                                    alignItems={`center`}
                                  >
                                    <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>
                                  </Stack>
                                  <Typography variant={`subtitle2`} sx={{ mt: 1 }}>
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
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
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) :
                          (
                            adminWallets.map((admin: AdminWallet, index: number) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 2,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                    <Typography variant={`subtitle1`} sx={{ mb: 1 }}>
                                      {admin.name}
                                    </Typography>
                                    <Stack
                                      component={`div`}
                                      direction={`row`}
                                      alignItems={`center`}
                                    >
                                      <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright, width: `100%`, textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap` }}>
                                        {admin.address.substring(0, 36)}...
                                      </Typography>

                                    </Stack>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
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
                                      onClick={() => {
                                        setOpen(true);
                                        setDeleteWhiteMode(`admin`);
                                        setDeleteAdminWalletAddress(admin.address);
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
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

            <Box component='section'
              sx={{
                px: {
                  md: 13,
                  ss: 2,
                  xs: 6,
                  sm: 8
                },
                py: 3,
              }}
            >
              <Typography variant="h6" sx={{ color: theme => theme.palette.common.white }}>
                Mint Entry
              </Typography>
            </Box>
            <Grid
              container
              direction={`row`}
              alignItems={`stretch`}
              spacing={2}
              sx={{
                px: {
                  md: 13,
                  ss: 2,
                  xs: 6,
                  sm: 8
                }
              }}
            >
              <Grid item ss={12} sm={6} lg={4}>
                <TableContainer
                  sx={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    background: theme => theme.palette.neutral.common
                  }}
                >
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
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main,
                          }}>

                        </TableCell>

                        <TableCell sx={{
                          background: theme => theme.palette.neutral.main,
                          border: 'none',
                          p: 2
                        }} >
                          <Typography variant='h6'>
                            Add A Mint
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={name}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Collection Name`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setName(event?.target?.value)
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            size={`small`}
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Price`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const toParse = parseFloat(event?.target?.value);
                              if (!isNaN(toParse)) {
                                setPrice(toParse)
                              }
                              else {
                                setPrice(-1)
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            type="number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Supply`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const toParse = parseFloat(event?.target?.value);
                              if (!isNaN(toParse)) {
                                setSupply(toParse)
                              }
                              else {
                                setSupply(-1)
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={link}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Link to Mint`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setLink(event?.target?.value);
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={image}
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Collection Image`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setImage(event?.target?.value);
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <TextField
                            label=""
                            type="time"
                            defaultValue=""
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              step: 300, // 5 min
                            }}
                            variant="outlined"
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Start Time CST`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setLaunchTime(event?.target?.value);
                            }}
                          />
                        </TableCell>

                        <TableCell
                          colSpan={2}
                          rowSpan={2}
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>
                          <AddPlus
                            sx={{
                              width: `1.75rem`,
                              height: `1.75rem`,
                              '&:hover': {
                                cursor: `pointer !important`,
                                opacity: 0.7
                              },
                              color: `white`
                            }}
                            onClick={async () => {
                              await addLaunchpad();
                            }}
                          />
                        </TableCell>

                      </TableRow>

                      <TableRow>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.common
                          }}>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: `none`,
                            px: 2,
                            py: 1,
                            pb: 0,
                            background: theme => theme.palette.neutral.common
                          }}>

                          <TextField
                            label=""
                            type="date"
                            defaultValue={``}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            size={`small`}
                            sx={{
                              width: `100%`,
                              border: `none`,
                              '& input': {
                                fontSize: `0.75rem`,
                                py: 0.875,
                                borderRadius: `4px`,
                                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
                              },
                              background: theme => theme.palette.neutral.paper
                            }}
                            placeholder={`Start Date`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setLaunchDate(event?.target?.value)
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item ss={12} sm={6} lg={4}>
                <TableContainer
                  sx={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    background: theme => theme.palette.neutral.common
                  }}
                >
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
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main,
                          }}>

                        </TableCell>

                        <TableCell sx={{
                          background: theme => theme.palette.neutral.main,
                          border: 'none',
                          p: 2
                        }} >
                          <Typography variant='h6'>
                            Future Logged Mints
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>

                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>

                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        futures == null ? (
                          new Array(10).fill(undefined).map((item: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 2,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                  <Typography variant={`subtitle2`} sx={{ mb: 1 }}>
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>
                                  <Stack
                                    component={`div`}
                                    direction={`row`}
                                    alignItems={`center`}
                                  >
                                    <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>

                                    <Typography variant={`subtitle2`} sx={{ ml: 4, color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>
                                  </Stack>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
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
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) :
                          (
                            futures.map((future: any, index: number) => {
                              const datestamp = new Date(future?.timestamp);
                              return (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 2,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                    <Typography variant={`subtitle1`} sx={{ mb: 1 }}>
                                      {future?.name}
                                    </Typography>
                                    <Stack
                                      component={`div`}
                                      direction={`row`}
                                      alignItems={`center`}
                                    >
                                      <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                        Date {`0${datestamp.getUTCMonth() + 1}`.slice(-2)} . {`0${datestamp.getUTCDate()}`.slice(-2)}
                                      </Typography>

                                      <Typography variant={`subtitle2`} sx={{ ml: 4, color: theme => theme.palette.neutral.bright }}>
                                        Time {`0${datestamp.getUTCHours()}`.slice(-2)} : {`0${datestamp.getUTCMinutes()}`.slice(-2)}
                                      </Typography>
                                    </Stack>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
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
                                      onClick={() => {
                                        setDeleteLaunchpad(future?.symbol);
                                        setMode(`future`);
                                        setOpenConf(true);
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
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

              <Grid item ss={12} sm={6} lg={4}>
                <TableContainer
                  sx={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: `hidden`,
                    background: theme => theme.palette.neutral.common
                  }}
                >
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
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main,
                          }}>

                        </TableCell>

                        <TableCell sx={{
                          background: theme => theme.palette.neutral.main,
                          border: 'none',
                          p: 2
                        }} >
                          <Typography variant='h6'>
                            Past Logged Mints
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: `none`,
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>
                        </TableCell>
                        <TableCell
                          sx={{
                            border: `none`,
                            width: '5%',
                            px: 1,
                            py: 1,
                            background: theme => theme.palette.neutral.main
                          }}>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        pasts == null ? (
                          new Array(10).fill(undefined).map((item: any, index: number) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 2,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                  <Typography variant={`subtitle2`} sx={{ mb: 1 }}>
                                    <Skeleton animation="wave" sx={{ width: `100%` }} />
                                  </Typography>
                                  <Stack
                                    component={`div`}
                                    direction={`row`}
                                    alignItems={`center`}
                                  >
                                    <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>

                                    <Typography variant={`subtitle2`} sx={{ ml: 4, color: theme => theme.palette.neutral.bright }}>
                                      <Skeleton animation="wave" sx={{ width: `64px` }} />
                                    </Typography>
                                  </Stack>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
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
                                  />
                                </TableCell>

                                <TableCell
                                  sx={{
                                    border: `none`,
                                    width: '5%',
                                    px: 1,
                                    py: 1,
                                    background: theme => theme.palette.neutral.common
                                  }}>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) :
                          (
                            pasts.map((past: any, index: number) => {
                              const datestamp = new Date(past?.timestamp);
                              return (
                                <TableRow key={index}>
                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 2,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
                                    <Typography variant={`subtitle1`} sx={{ mb: 1 }}>
                                      {past?.name}
                                    </Typography>
                                    <Stack
                                      component={`div`}
                                      direction={`row`}
                                      alignItems={`center`}
                                    >
                                      <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.neutral.bright }}>
                                        Date {`0${datestamp.getUTCMonth() + 1}`.slice(-2)} . {`0${datestamp.getUTCDate()}`.slice(-2)}
                                      </Typography>

                                      <Typography variant={`subtitle2`} sx={{ ml: 4, color: theme => theme.palette.neutral.bright }}>
                                        Time {`0${datestamp.getUTCHours()}`.slice(-2)} : {`0${datestamp.getUTCMinutes()}`.slice(-2)}
                                      </Typography>
                                    </Stack>
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
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
                                      onClick={() => {
                                        setDeleteLaunchpad(past?.symbol);
                                        setMode(`past`);
                                        setOpenConf(true);
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      border: `none`,
                                      width: '5%',
                                      px: 1,
                                      py: 1,
                                      background: theme => theme.palette.neutral.common
                                    }}>
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

            <Dialog
              open={openConf}
              onClose={closeConfDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Do you want to delete this launchpad?"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={closeConfDialog}><Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.text.primary }} >Cancel</Typography></Button>
                <Button onClick={async () => { await removeLaunchpad() }} autoFocus>
                  <Typography variant={`subtitle2`} sx={{ color: theme => theme.palette.text.primary }} >Delete</Typography>
                </Button>
              </DialogActions>
            </Dialog>
          </>
          :
          <Stack
            alignItems={`center`}
            justifyContent={`center`}
            sx={{
              width: `100%`,
              minHeight: `100vh`,
              maxHeight: `100vh`
            }}
          >
            <Typography variant={`h6`}>Authienticating...</Typography>
          </Stack>
      }


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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={async () => {
            if (deleteWhiteMode == `wallet`) {
              await deleteWhiteWallet(deleteWhiteWalletAddress);
              return;
            }
            if (deleteWhiteMode == `nft`) {
              await deleteWhiteNft(deleteWhiteNftAddress);
              return;
            }
            if (deleteWhiteMode == `admin`) {
              await deleteAdminWallet(deleteAdminWalletAddress);
              return;
            }
          }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={openPop}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {
          poperData.split(",").map((address: string) => {
            return <Typography variant="subtitle2" sx={{ p: 1 }}>
              {
                address
              }
            </Typography>
          })
        }

      </Popover>
    </Box>
  );
}

export default Home;