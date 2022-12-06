import React, { Fragment } from "react";
import { useRouter } from 'next/router'
import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const ProfileIcon = (props: SvgIconProps) => {
  const router = useRouter();
  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;

    return path.includes(menuUrl);
  }
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.69 16.47"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Token_Tracker" data-name="Token Tracker"><g id="Main_Sidebar_copy" data-name="Main Sidebar copy"><path className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/profile') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} d="M15.1,12.52a9.35,9.35,0,0,1-14.51,0,8.09,8.09,0,0,1,4.5-4.08,4.45,4.45,0,1,1,5.52,0A8.07,8.07,0,0,1,15.1,12.52Z" /></g></g></g></svg>
    </SvgIcon>
  );
};

export default ProfileIcon;
