import React, { Fragment } from "react";

import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const WhiteCircle = (props: SvgIconProps) => {
  const linkRouter = useRouter();
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);

  const isActive = (url: string) => {
    //used pathname before news category page.
    return linkRouter.asPath.includes(url);
  };

  React.useEffect(() => {
    (async () => {

    })()
  }, []);

  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" strokeMiterlimit={10} viewBox="0 0 19.71 19.71"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Main_Sidebar" data-name="Main Sidebar"><g id="Buttons"><g id="Page_Icons" data-name="Page Icons"><circle className="cls-1" cx="9.86" cy="9.86" r="9.36" strokeLinecap={`round`} /></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default WhiteCircle;
