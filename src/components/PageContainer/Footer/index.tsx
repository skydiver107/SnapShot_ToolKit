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

interface FooterProps {
  children?: any
}

const Footer = (props: FooterProps) => {
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
    <Box
      component={`footer`}
      sx={{
        background: theme => `${theme.palette.background.default}`,
        left: 0,
        right: 0,
        bottom: 0,
        py: 3
      }}
    >

    </Box>
  );
};

export default Footer;
