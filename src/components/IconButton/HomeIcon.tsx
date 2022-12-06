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

  React.useEffect(() => {
    const res = getCurMenu(`/home`)
  }, [])

  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.98 15.6" fill={`none`}
        stroke={
          // (theme != `` && theme == `dark`) ? `#fff` : `#FFFFFF`
          getCurMenu('/home') ? `#fff` :
            (theme != `` && theme == `dark`) ? `#fff` : `#FFFFFF`
        }
      ><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Main_Sidebar" data-name="Main Sidebar"><g id="Buttons"><g id="Page_Icons" data-name="Page Icons"><polygon className="cls-1" points="13.48 15.1 0.5 15.1 0.5 7.05 6.99 0.7 13.48 7.05 13.48 15.1" /></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default HomeIcon;
