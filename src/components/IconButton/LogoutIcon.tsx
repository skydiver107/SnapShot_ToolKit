import React, { Fragment } from "react";

import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const HomeIcon = (props: SvgIconProps) => {

  const theme = useAppSelector((state: RootState) => state.isOwner.theme);

  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.62 15.84"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Main_Sidebar" data-name="Main Sidebar"><g id="Buttons"><g id="Page_Text" data-name="Page Text"><g id="Layer_147" data-name="Layer 147"><g id="Layer_148" data-name="Layer 148"><polyline className="cls-1" fill={`none`} stroke={(theme != `` && theme == `dark`) ? `#fff` : `#FFFFFF`} strokeLinecap={`round`} strokeLinejoin={`round`} points="6.35 7.92 17.12 7.92 14.96 5.77" /><line className="cls-1" fill={`none`} stroke={(theme != `` && theme == `dark`) ? `#fff` : `#FFFFFF`} strokeLinecap={`round`} strokeLinejoin={`round`} x1="16.74" y1="7.92" x2="14.61" y2="10.05" /></g><path className="cls-2" d="M11.34,1a.37.37,0,0,1,.37.37v13.1a.37.37,0,0,1-.37.37h-10A.36.36,0,0,1,1,14.47V1.37A.36.36,0,0,1,1.37,1h10m0-1h-10A1.37,1.37,0,0,0,0,1.37v13.1a1.37,1.37,0,0,0,1.37,1.37h10a1.37,1.37,0,0,0,1.37-1.37V1.37A1.37,1.37,0,0,0,11.34,0Z" /></g></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default HomeIcon;
