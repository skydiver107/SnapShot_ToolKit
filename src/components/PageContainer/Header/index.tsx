import React, { Fragment } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Skeleton from '@mui/material/Skeleton';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { MENU } from "src/common/config";

interface HeaderProps {
  children?: any
}

const Header = (props: HeaderProps) => {
  const linkRouter = useRouter();

  const isActive = (url: string) => {
    //used pathname before news category page.
    return linkRouter.asPath.includes(url);
  };

  React.useEffect(() => {
    (async () => {

    })()
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        color: theme => `${theme.palette.text.primary}`,
        background: theme => `${theme.palette.background.default}`
      }}
    >
      <Box
        sx={{
          px: 2
        }}
      >
        <Toolbar variant="dense" sx={{ py: 2.5 }}>

          <Typography variant="h5" component="p" sx={{ flexGrow: 1 }}>
            <Link href="/">
              Snapshot Toolkit
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 0, display: `flex` }} >
            {MENU.map((menu: { menu: string, url: string }, index: number) => (
              <Typography
                variant="body1"
                color="inherit"
                component="p"
                key={index}
                sx={{
                  ml: 4,
                  '&:hover': {
                    opacity: 0.5
                  }
                }}
              >
                <Link href={menu.url}>
                  {menu.menu}
                </Link>
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;
