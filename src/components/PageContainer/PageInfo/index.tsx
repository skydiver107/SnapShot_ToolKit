import React, { Fragment } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { MENU } from "src/common/config";

interface PageInfoProps {
  children?: any
}

export type menuProps = {
  id: number
  menu: string,
  url: string,
  title: string,
};

const PageInfo = (props: PageInfoProps) => {
  const linkRouter = useRouter();

  const getPageTitle = (): string => {
    const path = linkRouter.asPath;
    const isMatch: number = MENU.findIndex((menu: menuProps, index: number) => {
      return path.includes(menu.url);
    });

    const res = path.includes('tracker/nfts/')
    if (res) {
      return `Detail`
    }

    if (isMatch >= 0) {
      return MENU[isMatch].title;
    }

    return ``;
  }

  React.useEffect(() => {

  }, []);

  return (
    <Box
      component={`section`}
      position="static"
      sx={{
        color: theme => `${theme.palette.text.disabled}`,
        borderBottom: theme => `solid 2px ${theme.palette.neutral.border}`
      }}
    >
      <Box
        sx={{
          px: {
            md: 13,
            ss: 2,
            xs: 6,
            sm: 8
          },
        }}
      >
        <Toolbar variant="dense" sx={{
          py: 1.5,
          paddingLeft: `0 !important`,
          paddingRight: `0 !important`,
          display: {
            ss: `block`,
            sm: `flex`
          }
        }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: `#FFFFFF` }}>
            {
              getPageTitle()
            }
          </Typography>
          {props.children}
        </Toolbar>
      </Box>
    </Box>
  );
};

export default PageInfo;
