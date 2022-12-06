import React, { Fragment } from "react";
import { useRouter } from 'next/router'
import { Provider as ReduxProvider } from "react-redux";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const AdminIcon = (props: SvgIconProps) => {
  const router = useRouter();
  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;

    return path.includes(menuUrl);
  }
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.29 15.29" fill={`none`} stroke={
        (theme != `` && theme == `dark`) ? `#fff` :
          getCurMenu('/admin') ? `#fff` : `#FFFFFF`
      } strokeLinejoin={`round`}><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Admin_Panel" data-name="Admin Panel"><g id="Main_Sidebar_copy_13" data-name="Main Sidebar copy 13"><g id="Buttons_copy_14" data-name="Buttons copy 14"><g id="Page_Icons_copy_14" data-name="Page Icons copy 14"><path className="cls-1" d="M6.58,1.54A3.53,3.53,0,0,1,7.49,5l6.79,6.79a1.74,1.74,0,1,1-2.46,2.46L5,7.49A3.55,3.55,0,0,1,.65,3.05L2.86,5.26a1.72,1.72,0,0,0,2,.3,2.71,2.71,0,0,0,.39-.3,1.57,1.57,0,0,0,.29-.4,1.67,1.67,0,0,0-.29-2L3,.65A3.56,3.56,0,0,1,6.58,1.54Z" /></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default AdminIcon;
