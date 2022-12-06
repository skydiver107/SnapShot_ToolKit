import React, { Fragment } from "react";
import { store, RootState } from "redux/store"
import { useRouter } from 'next/router'
import { useAppSelector, useAppDispatch } from "redux/hooks";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const TokenIcon = (props: SvgIconProps) => {
  const router = useRouter();
  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;

    return path.includes(menuUrl);
  }
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.71 19.71"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Main_Sidebar" data-name="Main Sidebar"><g id="Buttons"><g id="Page_Icons" data-name="Page Icons"><circle className="cls-1" cx="9.86" cy="9.86" r="6.62" fill={`none`}
        stroke={
          // `#fff`
          (theme != `` && theme == `dark`) ? `#fff` :
            getCurMenu('/tokens') ? `#fff` : `#FFFFFF`
        }
        strokeMiterlimit={`10`} /><circle className="cls-1" cx="9.86" cy="9.86" r="9.36" fill={`none`}
          stroke={
            // `#fff`
            (theme != `` && theme == `dark`) ? `#fff` :
              getCurMenu('/tokens') ? `#fff` : `#FFFFFF`
          } strokeMiterlimit={`10`} /></g></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default TokenIcon;
