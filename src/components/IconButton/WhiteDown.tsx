import React, { Fragment } from "react";

import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { store, RootState } from "redux/store"
const WhiteDown = (props: SvgIconProps) => {
  const linkRouter = useRouter();

  const isActive = (url: string) => {
    //used pathname before news category page.
    return linkRouter.asPath.includes(url);
  };
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  React.useEffect(() => {
    (async () => {

    })()
  }, []);

  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.71 15.71"  ><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Page_Graphics" data-name="Page Graphics"><g id="White_Stroke" data-name="White Stroke"><polygon id="arrow" strokeLinecap={`round`} className="cls-1" points="9.36 15.71 18.71 0 0 0 9.36 15.71" /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default WhiteDown;
