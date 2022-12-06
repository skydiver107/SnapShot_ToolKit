import React, { Fragment } from "react";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const ZoomGlass = (props: SvgIconProps) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.87 18.72"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="NFT_Tracker" data-name="NFT Tracker"><g id="Page_Graphics" data-name="Page Graphics"><g id="main_graphics_copy" data-name="main graphics copy"><path id="search_icon" data-name="search icon" className="cls-1" d="M14.68,10.63a7.39,7.39,0,0,0,.61-3,7.65,7.65,0,1,0-7.65,7.64,7.43,7.43,0,0,0,3.2-.71L15,18.72l3.89-3.9Zm-7,.61H7.49a3.75,3.75,0,1,1,3.9-3.89.76.76,0,0,1,0,.15A3.75,3.75,0,0,1,7.64,11.24Z" /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default ZoomGlass;
