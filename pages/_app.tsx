import React, { useMemo, useEffect, useState } from "react";

import { IntlProvider } from 'react-intl';

import { useRouter } from 'next/router';
import Head from 'next/head';
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { SessionProvider } from 'next-auth/react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

/**
 * Import for MUI
*/
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { ThemeProvider } from '@mui/material';
import lightTheme from 'src/theme/lightTheme';
import darkTheme from 'src/theme/darkTheme';

import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

/**
 * Import Web3.0 for Solana
*/
import { clusterApiUrl } from '@solana/web3.js';
import { createDefaultAuthorizationResultCache, SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css'); // Default styles that can be overridden by your app
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';

import NProgress from 'nprogress';
import '../public/css/nprogress.css';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import "styles/global.css";

import PageContainer from "src/components/PageContainer";
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { MobileMenu } from "@components/PageContainer/MobileMenu";
import getDataWithAxios from "src/common/services/getDataWithAxios";
import { DATA_API } from 'src/common/config';

export function Wrapper({ Component, pageProps }: any) {

  const dispatch = useAppDispatch();
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);

  const [mainTheme, setMainTheme] = useState<any>(lightTheme);
  const router = useRouter();

  const isLoginpage = () => {
    //used pathname before news category page.
    return router.asPath.includes(`login`);
  };

  // useEffect(() => {
  //   if (theme == ``) {
  //     if(localStorage.getItem(`snapshot-toolkit-theme`)) {
  //       const savedTheme = localStorage.getItem(`snapshot-toolkit-theme`);
  //       if(savedTheme == `dark`) {
  //         setMainTheme(darkTheme);
  //         dispatch(setTheme( `dark` ));
  //       }
  //       else {
  //         setMainTheme(lightTheme);
  //         dispatch(setTheme( `light` ));
  //       }
  //     }
  //     else {
  //       localStorage.setItem(`snapshot-toolkit-theme`, 'light');
  //       setMainTheme(lightTheme);
  //       dispatch(setTheme( `light` ));
  //     }
  //   }
  //   else {
  //     if(theme == `dark`) {
  //       setMainTheme(darkTheme);
  //     }
  //     else {
  //       setMainTheme(lightTheme);
  //     }
  //   }
  // }, [theme]);

  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            root: { textTransform: 'capitalize' }
          }}
        />

        {
          isLoginpage() ?
            <Component {...pageProps} /> :
            <>
              <PageContainer>
                <Component {...pageProps} />
              </PageContainer>
              <MobileMenu />
            </>
        }

      </ThemeProvider>
    </SnackbarProvider>
  )

}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST;//useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        appIdentity: { name: 'Solana Wallet Adapter App' },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  React.useEffect(() => {
    const handleStart = (url: string) => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    // <SessionProvider session={session}>
    <ReduxProvider store={store}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <Wrapper pageProps={pageProps} Component={Component}></Wrapper>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ReduxProvider>
    // </SessionProvider>
  );
}
