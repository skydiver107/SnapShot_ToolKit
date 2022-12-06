import React, { Fragment } from "react";

import { useRouter } from "next/router";

import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import Box from "@mui/material/Box";

import { Left } from "./Left";

interface ContainerProps {
  children: React.ReactNode
}

const PageContainer = (props: ContainerProps) => {
  const linkRouter = useRouter();
  const wallet = useWallet();
  const isActive = (url: string) => {
    //used pathname before news category page.
    return linkRouter.asPath.includes(url);
  };

  return (
    <>
      <Box
        component={`section`}
        sx={{
          background: theme => theme.palette.background.default
        }}
      >
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <Left />

          <Box
            sx={{
              width: '100%',
              ml: {
                ss: 0,
                lg: 25,
              }
            }}
          >
            <Box
              component={`main`}
              sx={{
                background: (isActive(`home`) && !wallet.connected) ? `url('/images/background/unverified.png')` : `url('/images/background/black.png')`,
                backgroundPosition: `center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `cover`,
                minHeight: `100vh`
              }}
            >
              {props.children}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* <Box
        sx={{
          position: `fixed`,
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          background: `url('/images/background/black.png')`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          pointerEvents: `none`,
          zIndex: 9
        }}
      >

      </Box> */}
    </>
  );
};

export default PageContainer;
