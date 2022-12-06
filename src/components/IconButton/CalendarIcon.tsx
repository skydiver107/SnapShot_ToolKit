import React, { Fragment } from "react";
import { useRouter } from 'next/router'
import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const CalendarIcon = (props: SvgIconProps) => {
  const router = useRouter();
  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;

    return path.includes(menuUrl);
  }
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }} >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.5 16.5"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Token_Tracker" data-name="Token Tracker"><g id="Main_Sidebar_copy" data-name="Main Sidebar copy"><g id="Buttons_copy" data-name="Buttons copy"><g id="Layer_151" data-name="Layer 151"><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="0.5" y1="12.82" x2="16" y2="12.82" /><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="0.79" y1="6.91" x2="16.29" y2="6.91" /><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="16" y1="9.95" x2="0.5" y2="9.95" /><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="8.38" y1="3.89" x2="8.38" y2="16" /><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="12.22" y1="3.89" x2="12.22" y2="16" /><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="4.5" y1="16" x2="4.5" y2="3.89" /><line className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} x1="0.5" y1="3.89" x2="16" y2="3.89" /><path className="cls-1" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/calendar') ? `#fff` : `#FFFFFF`
      } strokeMiterlimit={`10`} d="M.5.5V16H16V.5Z" /></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default CalendarIcon;
