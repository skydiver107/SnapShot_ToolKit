import React, { Fragment } from "react";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const AddPlus = (props: SvgIconProps) => {
  const linkRouter = useRouter();

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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.88 21.88"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Page_Graphics" data-name="Page Graphics"><g id="main_graphics_copy" data-name="main graphics copy"><polygon id="add_icon" data-name="add icon" className="cls-1" points="21.88 8.77 21.88 13.95 13.53 13.95 13.53 21.88 8.35 21.88 8.35 13.95 0 13.95 0 8.77 8.35 8.77 8.35 0 13.53 0 13.53 8.77 21.88 8.77" /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default AddPlus;
