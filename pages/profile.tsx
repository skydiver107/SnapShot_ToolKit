import React, { Fragment, useEffect, useRef, useState } from "react";

import { useRouter } from 'next/router';

import * as web3 from '@solana/web3.js';
import * as rayz from "@nfteyez/sol-rayz";
import {
  useConnection,
  useAnchorWallet
} from '@solana/wallet-adapter-react';
import base58 from 'bs58';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonGroup from "@mui/material/ButtonGroup";
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';

import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { useWallet } from "@solana/wallet-adapter-react";

import PageInfo from "@components/PageContainer/PageInfo";
import PaperButton from "@components/PaperButton";
import AddPlus from 'src/components/IconButton/AddPlus';

import { DATA_API, SIGN_KEY } from 'src/common/config';
import fetchData from "src/common/services/getDataWithAxios";
import { getFormLabelUtilityClasses } from "@mui/material";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface UserWallet {
  name: string,
  address: string,
  verified: boolean
}

const profile = () => {
  const router = useRouter();
  const { connection } = useConnection();
  const { enqueueSnackbar } = useSnackbar();
  const wallet = useWallet();
  const [discordUserData, setDiscordUserData] = React.useState<any>(null);

  const [userWallets, setUserWallets] = React.useState<UserWallet[] | null>(null);
  const [passesNfts, setPassesNfts] = React.useState<{ nftName: string, walletAddress: string }[] | null>(null);

  const [deleteWallet, setDeleteWallet] = React.useState<string>(``);

  const [walletName, setWalletName] = React.useState<string>(``);
  const [walletAddress, setWalletAddress] = React.useState<string>(``);

  // For loading
  const [showLoading, setShowLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addUserWallet = async () => {
    if (!walletName) {
      enqueueSnackbar('Please input wallet name correctly.', { variant: `warning` });
      return;
    }

    if (!walletAddress) {
      enqueueSnackbar('Please input wallet address correctly.', { variant: `warning` });
      return;
    }

    try {
      if (!web3.PublicKey.isOnCurve(new web3.PublicKey(walletAddress))) {
        enqueueSnackbar('Please input wallet address correctly.', { variant: `warning` });
        return;
      }
    }
    catch {
      enqueueSnackbar('Please input wallet address correctly.', { variant: `warning` });
      return;
    }

    const isDuplicated = userWallets.find((wallet: UserWallet) => {
      return wallet.address == walletAddress;
    });
    if (isDuplicated) {
      enqueueSnackbar('The wallet already exists. Please input another.', { variant: `warning` });
      return;
    }

    setShowLoading(true);
    try {
      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.ADD_USER_WALLET}`,
        data: {
          address: walletAddress,
          walletName: walletName
        }
      });

      if (result == true) {
        enqueueSnackbar('The wallet was successfully added.', { variant: `success` });
        setWalletAddress(``);
        setWalletName(``);
        setUserWallets([...userWallets, { name: walletName, address: walletAddress, verified: false }]);
      }
      else {
        enqueueSnackbar('The wallet was not added. Please try again.', { variant: `error` });
      }
    }
    catch (err) {
      enqueueSnackbar('The request was failed. Please try again.', { variant: `error` });
    }
    setShowLoading(false);
  }

  const verifyUserWallet = async (address: string) => {
    if (wallet?.publicKey?.toString() != address) {
      enqueueSnackbar('The wallet is not matched within your Phantom wallet.', { variant: `warning` });
      return;
    }

    try {
      const signature = await wallet.signMessage(new TextEncoder().encode(SIGN_KEY));
      const decodedSignature = base58.encode(signature);
      setShowLoading(true);
      const result = await fetchData({
        method: `post`,
        route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.VERIFY_USER_WALLET}`,
        data: {
          address: address,
          signedMessage: decodedSignature
        }
      });

      if (result == true) {
        const modified = userWallets.map((wallet: UserWallet) => {
          if (wallet.address == address) {
            return {
              ...wallet,
              verified: true
            }
          }
          return wallet;
        });
        setUserWallets([...modified]);
        enqueueSnackbar('The wallet was successfully verified.', { variant: `success` });
      }
      else {
        enqueueSnackbar('Wallet verification was failed. Please try again.', { variant: `error` });
      }
    }
    catch (err) {
      console.log(`wallet verify err: `, err);
      enqueueSnackbar('Wallet verification was failed. Please try again.', { variant: `error` });
    }
    setShowLoading(false);
  }

  const deletedUserWallet = async () => {
    setShowLoading(true);
    try {
      const result = await fetchData({
        method: `get`,
        route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.DELETE_USER_WALLET}?address=${deleteWallet}`,
      });

      if (result == true) {
        const removed = userWallets.filter((wallet: UserWallet) => {
          return wallet.address != deleteWallet;
        });
        setUserWallets([...removed]);
        enqueueSnackbar('The wallet was successfully deleted.', { variant: `success` });
      }
      else {
        enqueueSnackbar('The wallet was not deleted. Please try again.', { variant: `error` });
      }
    }
    catch (err) {
      enqueueSnackbar('The request was failed. Please try again.', { variant: `error` });
      return;
    }
    setShowLoading(false);
    handleClose();
  }

  React.useEffect(() => {
    (async () => {
      try {
        if (router?.isReady) {
          const walletAndDiscordData = await Promise.all([
            fetchData({
              method: `get`,
              route: `${DATA_API.GET_USER_INFO}`
            }),
            fetchData({
              method: `get`,
              route: `${DATA_API.WALLET_API.COMMON}${DATA_API.WALLET_API.GET_USER_WALLETS}`
            })
          ])
          const discordUser = walletAndDiscordData[0];
          const walletData = walletAndDiscordData[1];

          if (walletData && Array.isArray(walletData)) {
            setUserWallets([...walletData]);
          }
          else {
            setUserWallets(null);
          }

          if (discordUser?.id) {
            setDiscordUserData(discordUser);
          }
          else {
            setDiscordUserData(null);
          }
        }
      }
      catch (err) {
        console.log(`err in get discord user`);
        setDiscordUserData(null);
      }
      finally {
      }
    })()
  }, [router?.isReady]);

  React.useEffect(() => {
    (async () => {
      try {
        if (userWallets?.length > 0) {
          let addresses = userWallets.filter((userWalletData: UserWallet) => {
            return userWalletData.verified
          }).map((userWalletData: UserWallet) => {
            return new Promise((resolve, reject) => {
              resolve(rayz.getParsedNftAccountsByOwner({
                publicAddress: userWalletData.address,
                connection
              }));
            });
          });

          addresses.push(
            new Promise((resolve, reject) => {
              resolve(
                fetchData({
                  method: `get`,
                  route: `${DATA_API.WHITENFT_API.COMMON}${DATA_API.WHITENFT_API.GET_NFTS}`
                })
              )
            })
          );

          const nftsForUser = await Promise.all(addresses);

          if (nftsForUser[nftsForUser.length - 1] && Array.isArray(nftsForUser[nftsForUser.length - 1])) {
            let creators = ``;
            const creatorArr: any = nftsForUser[nftsForUser.length - 1];
            creatorArr.forEach((creator: any, index: number) => {
              if (creator && creator?.address) {
                creators = `${creators},${creator?.address}`;
              }
            });

            let passes: { nftName: string, walletAddress: string }[] = [];
            nftsForUser.forEach((nfts: any, index: number) => {
              if (index == nftsForUser.length - 1) {
                return;
              }
              if (nfts && Array.isArray(nfts)) {
                nfts.forEach((nft: any, idx: number) => {
                  if (nft?.data?.creators && nft?.data?.creators[0] && nft?.data?.creators[0]?.address && creators.includes(nft?.data?.creators[0]?.address)) {
                    passes.push({
                      nftName: nft?.data?.name || nft?.data?.symbol,
                      walletAddress: userWallets[index]?.address
                    });
                  }
                });
              }
            });
            setPassesNfts([...passes.sort((a: { nftName: string, walletAddress: string }, b: { nftName: string, walletAddress: string }) => {
              return a.nftName.localeCompare(b.nftName);
            })]);
          }
          else {
            setPassesNfts([]);
          }
        }
      }
      catch (err) {
        console.log(`err in get passes nft`, err);
        setPassesNfts([]);
      }
      finally {
      }
    })()
  }, [userWallets]);

  return (
    <Box component={`main`} >
      <PageInfo />
      <Box
        sx={{
          display: `flex`,
          alignItems: `stretch`,
          justifyContent: `space-between`,
          borderBottomRightRadius: 90,
          mx: `auto`,
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
          background: `none`,
          overflow: `hidden`,
          position: `relative`
        }}
      >
        <Grid container alignItems={`stretch`} justifyContent={`space-between`} spacing={3} my={4} >
          <Grid
            item
            lg={4}
            md={4}
            sm={12}
          >
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={1}
            >
              <Box component={`div`} sx={{ background: theme => theme.palette.neutral.main }}>
                <Typography variant={`h6`} sx={{ px: 4, py: 2 }}>Wallets</Typography>
              </Box>

              <Box
                sx={{
                  background: theme => theme.palette.background.default,
                  minHeight: `calc(100vh - 216px)`,
                  maxHeight: `calc(100vh - 216px)`,
                  overflow: `auto`
                }}
              >
                {
                  userWallets ?
                    userWallets.map((walletData: UserWallet, index: number) => {
                      return (
                        <Stack
                          direction={`column`}
                          justifyContent={`space-between`}
                          sx={{
                            borderBottom: theme => `solid ${theme.palette.background.paper} 4px`,
                            px: 4,
                            py: 2
                          }}
                          key={index}
                        >
                          <Stack
                            direction={`row`}
                            alignItems={`center`}
                            justifyContent={`space-between`}
                          >
                            <Typography variant={`h6`}>{walletData.name}</Typography>

                            <ButtonGroup variant="contained" aria-label="outlined primary button group"
                              sx={{
                                '& .MuiButtonGroup-grouped': {
                                  borderRight: `none !important`,
                                }
                              }}
                            >
                              <PaperButton size={`medium`} selected={false}
                                sx={{
                                  borderTopLeftRadius: 4,
                                  borderBottomLeftRadius: 4,
                                  py: `8px !important`,
                                  px: `16px !important`,
                                  '&:disabled': {
                                    border: `none`
                                  }
                                }}
                                onClick={
                                  async () => {
                                    await verifyUserWallet(walletData.address);
                                  }
                                }
                                disabled={walletData.verified}
                              >
                                <Typography
                                  variant={`subtitle2`}

                                >
                                  {
                                    walletData.verified ? `Verified` : `Verify`
                                  }
                                </Typography>
                              </PaperButton>

                              <PaperButton
                                size={`medium`}
                                selected={true}
                                sx={{
                                  borderTopRightRadius: 4,
                                  borderBottomRightRadius: 4,
                                  py: `8px !important`,
                                  px: `16px !important`
                                }}
                                onClick={
                                  async () => {
                                    setDeleteWallet(walletData.address);
                                    setOpen(true)
                                  }
                                }
                              >
                                <Typography
                                  variant={`subtitle2`}
                                >
                                  Delete
                                </Typography>
                              </PaperButton>
                            </ButtonGroup>
                          </Stack>
                          <Typography variant={`subtitle2`} sx={{ mt: 1, width: `100%`, textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap` }}>
                            {walletData.address.substring(0, 36)}
                          </Typography>
                        </Stack>
                      )
                    }) :
                    new Array(5).fill(undefined).map((value: any, index: number) => {
                      return (
                        <Stack
                          direction={`column`}
                          justifyContent={`space-between`}
                          sx={{
                            borderBottom: theme => `solid ${theme.palette.background.paper} 4px`,
                            px: 4,
                            py: 2
                          }}
                          key={index}
                        >
                          <Stack
                            direction={`row`}
                            alignItems={`center`}
                            justifyContent={`space-between`}
                          >
                            <Typography variant={`h6`}>
                              <Skeleton animation="wave" sx={{ width: `96px` }} />
                            </Typography>

                          </Stack>
                          <Typography variant={`subtitle2`} sx={{ mt: 1 }}>
                            <Skeleton animation="wave" sx={{ width: `256px` }} />
                          </Typography>
                        </Stack>
                      )
                    })
                }

                <Stack
                  direction={`row`}
                  alignItems={`center`}
                  justifyContent={`space-between`}
                  sx={{
                    px: 4,
                    py: 2
                  }}
                >
                  <Box sx={{ width: `70%` }}>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={walletName}
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
                      placeholder={`Wallet Name`}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWalletName(event?.target?.value);
                      }}
                    />

                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={walletAddress}
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
                        background: theme => theme.palette.neutral.paper,
                        mt: 1
                      }}
                      placeholder={`Wallet Address`}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWalletAddress(event?.target?.value);
                      }}
                    />
                  </Box>

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
                      await addUserWallet();
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid
            item
            lg={4}
            md={4}
            sm={12}
          >
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={1}
            >
              <Box component={`div`} sx={{ background: theme => theme.palette.neutral.main }}>
                <Typography variant={`h6`} sx={{ px: 4, py: 2 }}>Settings</Typography>
              </Box>

              <Box
                sx={{
                  background: theme => theme.palette.background.default,
                  minHeight: `calc(100vh - 216px)`,
                  maxHeight: `calc(100vh - 216px)`,
                  overflow: `auto`,
                  px: 4,
                  py: 2
                }}
              >
                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>Display Name</Typography>
                  {
                    discordUserData == null ?
                      <Skeleton animation="wave" sx={{ width: `100%`, mt: 1 }} /> :
                      <Typography
                        variant={`subtitle2`}
                        sx={{
                          mt: 1,
                          py: 1,
                          background: theme => theme.palette.background.paper
                        }}
                      >
                        {discordUserData?.username}
                      </Typography>
                  }
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>Discord</Typography>
                  {
                    discordUserData == null ?
                      <Skeleton animation="wave" sx={{ width: `100%`, mt: 1 }} /> :
                      <Typography
                        variant={`subtitle2`}
                        sx={{
                          mt: 1,
                          py: 1,
                          background: theme => theme.palette.background.paper
                        }}
                      >
                        {`${discordUserData?.username}#${discordUserData?.discriminator}`}
                      </Typography>
                  }
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>E-mail</Typography>

                  {
                    discordUserData == null ?
                      <Skeleton animation="wave" sx={{ width: `100%`, mt: 1 }} /> :
                      <Typography
                        variant={`subtitle2`}
                        sx={{
                          mt: 1,
                          py: 1,
                          background: theme => theme.palette.background.paper
                        }}
                      >
                        &nbsp;
                      </Typography>
                  }
                </Stack>

                <Stack
                  direction={`column`}
                  alignItems={`stretch`}
                  justifyContent={`space-between`}
                  pb={2}
                >
                  <Typography variant={`h6`}>Timezone</Typography>
                  {
                    discordUserData == null ?
                      <Skeleton animation="wave" sx={{ width: `100%`, mt: 1 }} /> :
                      <Typography
                        variant={`subtitle2`}
                        sx={{
                          mt: 1,
                          py: 1,
                          background: theme => theme.palette.background.paper
                        }}
                      >
                        &nbsp;
                      </Typography>
                  }
                </Stack>

              </Box>
            </Stack>
          </Grid>

          <Grid
            item
            lg={4}
            md={4}
            sm={12}
          >
            <Stack
              direction={`column`}
              alignItems={`stretch`}
              justifyContent={`space-between`}
              spacing={1}
            >
              <Box component={`div`} sx={{ background: theme => theme.palette.neutral.main }}>
                <Typography variant={`h6`} sx={{ px: 4, py: 2 }}>Passes and Subscriptions</Typography>
              </Box>

              <Box
                sx={{
                  background: theme => theme.palette.background.default,
                  minHeight: `calc(100vh - 216px)`,
                  maxHeight: `calc(100vh - 216px)`,
                  overflow: `auto`
                }}
              >
                {
                  passesNfts ?
                    (passesNfts?.length > 0 ?
                      <>
                        {
                          passesNfts.map((pass: { nftName: string, walletAddress: string }, index: number) => {
                            return (
                              <Stack
                                direction={`column`}
                                justifyContent={`space-between`}
                                sx={{
                                  borderBottom: theme => `solid ${theme.palette.background.paper} 4px`,
                                  px: 4,
                                  py: 2
                                }}
                                key={index}
                              >
                                <Stack
                                  direction={`row`}
                                  alignItems={`center`}
                                  justifyContent={`space-between`}
                                >
                                  <Typography variant={`h6`}>{pass.nftName}</Typography>

                                </Stack>
                                <Typography variant={`subtitle2`} sx={{ mt: 1, width: `100%`, textOverflow: `ellipsis`, overflow: `hidden`, whiteSpace: `nowrap` }}>
                                  {pass.walletAddress.substring(0, 36)}
                                </Typography>
                              </Stack>
                            )
                          })
                        }
                        <Stack
                          direction={`column`}
                          justifyContent={`space-between`}
                          sx={{
                            px: 4,
                            py: 1
                          }}
                        >
                          <Typography variant={`subtitle2`} sx={{ lineHeight: 1.5 }}>
                            You have full utility through the Snapshot Toolkit.
                            <br />
                            No Subscription is needed at this time.
                          </Typography>
                        </Stack>
                      </> :
                      <Stack
                        direction={`column`}
                        justifyContent={`space-between`}
                        sx={{
                          px: 4,
                          py: 1
                        }}
                      >
                        <Typography variant={`subtitle2`} sx={{ lineHeight: 1.5 }}>
                          You do not have a verified NFT, wallet address or subscription. Please verify a wallet containing a whitelisted NFT to unlock the full Snapshot Toolkit.
                        </Typography>

                        <Typography variant={`subtitle2`} sx={{ mt: 1, lineHeight: 1.5 }}>
                          If you think you should be verified and are not please reach out to a team member on our discord.
                        </Typography>
                      </Stack>
                    )
                    :
                    new Array(5).fill(undefined).map((pass: any, index: number) => {
                      return (
                        <Stack
                          direction={`column`}
                          justifyContent={`space-between`}
                          sx={{
                            borderBottom: theme => `solid ${theme.palette.background.paper} 4px`,
                            px: 4,
                            py: 2
                          }}
                          key={index}
                        >
                          <Stack
                            direction={`row`}
                            alignItems={`center`}
                            justifyContent={`space-between`}
                            sx={{ width: `100%` }}
                          >
                            <Typography variant={`h6`} sx={{ width: `100%` }}>
                              <Skeleton animation="wave" sx={{ width: `40%` }} />
                            </Typography>

                          </Stack>
                          <Typography variant={`subtitle2`} sx={{ mt: 1 }}>
                            <Skeleton animation="wave" sx={{ width: `70%` }} />
                          </Typography>
                        </Stack>
                      )
                    })
                }
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={showLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete the wallet?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={async () => {
            await deletedUserWallet()
          }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default profile;