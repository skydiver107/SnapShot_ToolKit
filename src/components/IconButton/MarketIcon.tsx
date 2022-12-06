import React, { Fragment } from "react";
import { useRouter } from 'next/router'
import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setTheme } from "redux/slices/counterSlice";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const HomeIcon = (props: SvgIconProps) => {
  const router = useRouter();
  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;

    return path.includes(menuUrl);
  }
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);

  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }} >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.64 9.32" fill={`none`}
        stroke={
          (theme != `` && theme == `dark`) ? `#fff` :
            getCurMenu('/market') ? `#fff` : `#FFFFFF`
        }
        strokeLinecap={`round`} strokeLinejoin={`round`}><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Main_Sidebar" data-name="Main Sidebar"><g id="Buttons"><g id="Page_Text" data-name="Page Text"><g id="Layer_147" data-name="Layer 147"><g id="Layer_149" data-name="Layer 149"><line className="cls-1" x1="17.14" y1="0.38" x2="14.87" y2="0.38" strokeWidth={`0.75px`} /><polyline className="cls-2" points="0.5 8.82 5.23 4.57 9.14 8.43 17.14 0.51 17.14 2.85" /></g></g></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default HomeIcon;
