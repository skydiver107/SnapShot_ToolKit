import React, { Fragment } from "react";
import { useRouter } from 'next/router'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { store, RootState } from "redux/store"
const NftsIcon = (props: SvgIconProps) => {
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  const router = useRouter();
  const getCurMenu = (menuUrl: string): boolean => {
    const path = router.asPath;

    return path.includes(menuUrl);
  }
  return (
    <SvgIcon {...props} sx={{ width: `20px`, height: `20px` }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.5 16.5"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Main_Sidebar" data-name="Main Sidebar"><g id="Layer_150" data-name="Layer 150"><path className="cls-1" d="M13.75,2.81V13.69H12.08a3.8,3.8,0,0,0-2.16-3.43,2.61,2.61,0,1,0-3.34,0,3.8,3.8,0,0,0-2.16,3.43H2.87V2.81Z"
        stroke={
          (theme != `` && theme == `dark`) ? `#fff` :
            getCurMenu('/nfts') ? `#fff` : `#FFFFFF`

        }
        fill={
          // `none`
          (theme != `` && theme == `dark`) ? `#fff` :
            getCurMenu('/nfts') ? `#fff` : `#FFFFFF`
        }
      /><path className="cls-2" d="M.5.5V16H16V.5ZM13.75,13.69H2.87V2.81H13.75Z"
        fill={
          // `none`
          // getCurMenu('/nfts') ? `#FFFFFF` : `#fff`
          (theme != `` && theme == `dark`) ? `#fff` :
            getCurMenu('/nfts') ? `#FFFFFF` : `#fff`
        }
        stroke={
          // `#fff`
          // getCurMenu('/nfts') ? `#fff` : `#FFFFFF`
          (theme != `` && theme == `dark`) ? `#371830` :
            getCurMenu('/nfts') ? `#fff` : `#FFFFFF`
        }
        strokeMiterlimit={`10`} /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default NftsIcon;
