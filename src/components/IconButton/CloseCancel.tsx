import React, { Fragment } from "react";

import { useRouter } from "next/router";
import { store, RootState } from "redux/store"
import { useAppSelector, useAppDispatch } from "redux/hooks";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const CloseCancel = (props: SvgIconProps) => {
  const linkRouter = useRouter();
  const theme = useAppSelector((state: RootState) => state.isOwner.theme);
  const isActive = (url: string) => {
    //used pathname before news category page.
    return linkRouter.asPath.includes(url);
  };

  React.useEffect(() => {
    (async () => {

    })()
  }, []);

  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.82 11.82"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Data_Entry" data-name="Data Entry"><polygon id="exit_icon" data-name="exit icon" className="cls-1" points="11.64 9.6 9.41 11.82 5.82 8.23 2.41 11.64 0.18 9.41 3.59 6 0 2.41 2.23 0.18 5.82 3.77 9.6 0 11.82 2.23 8.05 6 11.64 9.6" /></g></g></g></svg>
    </SvgIcon>
  );
};

export default CloseCancel;
