import React, { Fragment } from "react";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const ShopbagButton = (props: SvgIconProps) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.48 22.56"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Details"><g id="Main_Sidebar_copy_4" data-name="Main Sidebar copy 4"><g id="highlight_color_copy_2" data-name="highlight color copy 2"><path className="cls-1" d="M16.37,6.13a6.14,6.14,0,0,0-12.27,0H0V22.56H20.48V6.13ZM10.24,2.3a3.84,3.84,0,0,1,3.83,3.83H6.4A3.85,3.85,0,0,1,10.24,2.3Z" /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default ShopbagButton;
