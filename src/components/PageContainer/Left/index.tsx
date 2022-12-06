import * as React from 'react';

import { useRouter } from 'next/router'
import Link from 'next/link';

import { RootState } from "redux/store";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

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

var localStorage = require('localStorage');

import { Avatar, createTheme, responsiveFontSizes, Tooltip } from "@mui/material";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from 'src/components/LogoIcon';
import HomeIcon from '@components/IconButton/HomeIcon';
import MarketIcon from '@components/IconButton/MarketIcon';
import NftsIcon from '@components/IconButton/NftsIcon';
import TokenIcon from '@components/IconButton/TokenIcon';
import CalendarIcon from '@components/IconButton/CalendarIcon';
import TwitterButton from '@components/IconButton/TwitterButton';
import DiscordButton from '@components/IconButton/DiscordButton';
import ProfileIcon from '@components/IconButton/ProfileIcon';
import AdminIcon from '@components/IconButton/AdminIcon';
import LogoutIcon from '@components/IconButton/LogoutIcon';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { DATA_API, MENU, menuProps, DISCORD_AVATAR_URL } from 'src/common/config';
import { handleImageError } from "src/common/utils/handleImageError";
import fetchData from "src/common/services/getDataWithAxios";

export const Left = () => {
  const theme = createTheme();
  const router = useRouter();

  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();

  const dispatch = useAppDispatch();
  const mainTheme = useAppSelector((state: RootState) => state.isOwner.theme);

  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;
    if (path.includes(`coming`)) {
      return false;
    }
    return path.includes(menuUrl);
  }

  const [menues, setMenues] = React.useState<menuProps>(MENU);
  const [discordUserData, setDiscordUserData] = React.useState<any>(null);

  const [isAdmin, setIsAdmin] = React.useState(false);

  const changeTheme = () => {
    localStorage.setItem(`snapshot-toolkit-theme`, (mainTheme == `light` || mainTheme == ``) ? `dark` : `light`);
    dispatch(setTheme((mainTheme == `light` || mainTheme == ``) ? `dark` : `light`));
  }

  React.useEffect(() => {
    (async () => {
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
          }
          else {
            setIsAdmin(false);
          }
        }
        else {
          setIsAdmin(false);
        }
      }
      catch (err) {
        setIsAdmin(false);
      }
      finally {
      }
    })()
  }, [router.isReady, anchorWallet]);

  React.useEffect(() => {
    (async () => {
      try {
        setMenues([...MENU]);
      }
      catch (err) {
      }
      finally {
      }
    })()
  }, [isAdmin]);

  React.useEffect(() => {
    (async () => {
      try {
        if (router?.isReady) {
          const discordUser = await fetchData({
            method: `get`,
            route: `${DATA_API.GET_USER_INFO}`
          });

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

  return (
    <Paper
      sx={{
        position: `fixed`,
        minWidth: {
          ss: `200px`
        },
        display: {
          ss: `none`,
          lg: `block`
        },
        zIndex: 10,
        minHeight: `100vh`,
        borderRadius: 'unset !important ',
        borderRight: theme => `2px solid ${theme.palette.neutral.border}`,
        // background: mainTheme == `dark` ? theme => theme.palette.background.paper : theme => theme.palette.background.default,
        background: theme => theme.palette.background.paper
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          py: 2
        }}
      >
        <Grid item ss={2}>

        </Grid>

        <Grid
          item
          ss={8}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"

        >
          <Grid item>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <LogoIcon sx={{
                width: `3rem`,
                height: `3rem`
              }} />
            </Stack>
          </Grid>
        </Grid>

        <Grid item ss={2}>

        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item ss={2}>

        </Grid>

        <Grid
          item
          ss={8}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"

        >
          <Grid item>
            <Stack
              direction="row"
              justifyContent="left"
              alignItems="center"
            >
              <Link href={`/`}>
                <Typography variant={`h6`}>
                  Toolkit
                </Typography>
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Grid item ss={2}>

        </Grid>
      </Grid>

      {
        menues.map((menu: any, idx: any) => {
          if (idx == 6 && (!isAdmin || !discordUserData?.id)) {
            return <React.Fragment key={idx}></React.Fragment>
          }
          if (idx == 5 && !discordUserData?.id) {
            return <React.Fragment key={idx}></React.Fragment>
          }
          return (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{
                position: {
                  ss: idx > 4 ? `absolute` : ``
                },
                bottom: {
                  ss: idx == 5 ? 100 : (idx == 6 ? 140 : ``)
                },
                left: {
                  ss: idx > 4 ? 0.5 : 0
                },
                mt: {
                  ss: idx == 0 ? 3.5 : ``
                }
              }}
              key={idx}
            >
              <Grid item ss={2}>

              </Grid>

              <Grid
                item
                ss={8}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                  color: getCurMenu(menu.url) ? `white` : theme => theme.palette.text.primary,
                  borderRadius: 1,
                  border: theme => `solid 1px ${theme.palette.background.paper}`,
                  py: {
                    ss: idx == 5 ? 0.5 : 1
                  },
                  cursor: `pointer`,
                  '&:hover': {
                    border: theme => `solid 1px ${theme.palette.neutral.main}`,
                  },
                  background: getCurMenu(menu.url) ? theme => theme.palette.neutral.main : theme => theme.palette.background.paper,
                }}
                onClick={() => {
                  router.push(`/${menu.url}`)
                }}
              >
                <Grid item ss={6}>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ ml: 2 }}
                  >
                    {
                      idx == 0 && <HomeIcon />
                    }
                    {
                      idx == 1 && <MarketIcon />
                    }
                    {
                      idx == 2 && <NftsIcon />
                    }
                    {
                      idx == 3 && <TokenIcon />
                    }
                    {
                      idx == 4 && <CalendarIcon />
                    }
                    {
                      idx == 5 &&
                      <Avatar
                        alt="User Profile"
                        src={`${DISCORD_AVATAR_URL}/${discordUserData?.id}/${discordUserData?.avatar}.png`}
                        sx={{
                          width: 30,
                          height: 30,
                          border: `solid 2px white`
                        }}
                      />
                    }
                    {
                      idx == 6 && <AdminIcon />
                    }
                  </Stack>
                </Grid>
                <Grid item ss={6}>
                  {
                    idx == 5 ? <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 500 }}
                      title={discordUserData?.username}
                      placement="right"
                      arrow
                    >
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                      >
                        <Typography variant={`subtitle1`} sx={{
                          color: getCurMenu(menu.url) ? `white` : theme => theme.palette.text.primary,
                        }} >
                          {menu.menu}
                        </Typography>
                      </Stack>
                    </Tooltip> :
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                      >
                        <Typography variant={`subtitle1`} sx={{
                          color: getCurMenu(menu.url) ? `white` : theme => theme.palette.text.primary,
                        }} >
                          {menu.menu}
                        </Typography>
                      </Stack>
                  }
                </Grid>
              </Grid>

              <Grid item ss={2}>

              </Grid>
            </Grid>
          )
        })
      }

      {
        discordUserData?.id && <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid ss={2}></Grid>
          <Grid
            item
            ss={8}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: `absolute`,
              mt: 4,
              bottom: 56,
              '& button': {
                width: `100%`,
                textAlign: `center`,
                fontWeight: 400,
                justifyContent: `center`,
                color: `white`,
                lineHeight: 1.5,
                height: `auto`,
                border: theme => `solid 1px ${theme.palette.background.paper}`,
                px: 2,
                py: 1,
                cursor: `pointer`,
                background: theme => theme.palette.neutral.main,
                fontSize: `0.875rem`,
                fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
              }
            }}
          >
            {
              anchorWallet?.publicKey ?
                <WalletDisconnectButton
                  endIcon={undefined}
                  startIcon={undefined}
                  className={`wallet-button`}
                /> :
                <WalletMultiButton
                  endIcon={undefined}
                  startIcon={undefined}
                  className={`wallet-button`}
                />
            }
          </Grid>
          <Grid ss={2}></Grid>
        </Grid>
      }

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        position={`absolute`}
        bottom={1}
        sx={{
          pb: 2
        }}
      >
        <Grid
          item
          ss={12}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"

        >
          <Grid item>
            <Stack
              direction="row"
              justifyContent={`space-between`}
              alignItems="center"
              spacing={2}
            >
              {/* <Grid ss={3}>
                    {mainTheme == 'dark' ? <Brightness7Icon sx={{ '&:hover': { cursor: `pointer` } }} onClick={changeTheme} /> : <Brightness4Icon onClick={changeTheme} sx={{ '&:hover': { cursor: `pointer` } }} />}
                  </Grid> */}
              <Grid item ss={4} ><DiscordButton sx={{ '&:hover': { cursor: `pointer` } }} /></Grid>
              <Grid item ss={4}><TwitterButton sx={{ '&:hover': { cursor: `pointer` } }} /></Grid>
              {
                discordUserData?.id ?
                  <Grid item ss={4}>
                    <LogoutIcon
                      sx={{
                        '&:hover': {
                          cursor: `pointer`
                        }
                      }}
                      onClick={async () => {
                        router.push(DATA_API.SIGN_OUT);
                      }}
                    />
                  </Grid> :
                  <></>
              }
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}