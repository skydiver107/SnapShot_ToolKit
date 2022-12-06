import React, { Fragment } from "react";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const AddMarket = (props: SvgIconProps) => {
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
        <SvgIcon {...props} sx={{
            color: theme => theme.palette.neutral.main
        }} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.31 13.31"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Market"><g id="Data_Entry:_Trending_Projects" data-name="Data Entry: Trending Projects"><polygon id="add_icon" data-name="add icon" className="cls-1" points="7.98 13.31 4.83 13.31 4.83 8.23 0 8.23 0 5.08 4.83 5.08 4.83 0 7.98 0 7.98 5.08 13.31 5.08 13.31 8.23 7.98 8.23 7.98 13.31" /></g></g></g></svg>
        </SvgIcon>
    );
};

export default AddMarket;
