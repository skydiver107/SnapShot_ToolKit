import React, { Fragment } from "react";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
const WhiteUp = (props: SvgIconProps) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.71 15.71"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Token_Tracker" data-name="Token Tracker"><g id="Page_Graphics_copy" data-name="Page Graphics copy"><g id="main_graphics_copy_7" data-name="main graphics copy 7"><polygon strokeLinecap={`round`} id="arrow" className="cls-1" points="9.36 0 0 15.71 18.71 15.71 9.36 0" /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default WhiteUp;
