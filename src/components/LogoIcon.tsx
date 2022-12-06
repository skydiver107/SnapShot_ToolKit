import React, { Fragment } from "react";

import { useRouter } from "next/router";

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const LogoIcon = (props: SvgIconProps) => {
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.46 54.46"><defs><style></style></defs><g id="Layer_2" data-name="Layer 2"><g id="Market"><g id="Main_Sidebar_copy_10" data-name="Main Sidebar copy 10"><g id="Logo_copy_11" data-name="Logo copy 11"><path className="cls-1" d="M54.09,22.77c-.14-.87-.33-1.73-.55-2.57a27.41,27.41,0,0,0-1.78-4.81c-.34-.69-.7-1.37-1.09-2a27.46,27.46,0,0,0-3.41-4.59c-.26-.28-.52-.55-.79-.82l-.76-.73a27.58,27.58,0,0,0-4.52-3.38c-.66-.4-1.33-.76-2-1.1A27.64,27.64,0,0,0,34,.84C33.13.63,32.27.45,31.39.32A27.23,27.23,0,0,0,.32,31.39c.13.88.31,1.75.52,2.59a27.64,27.64,0,0,0,1.91,5.18c.34.7.7,1.37,1.1,2a27.58,27.58,0,0,0,3.38,4.52l.73.76.83.79a26.85,26.85,0,0,0,4.58,3.41c.65.39,1.33.75,2,1.09a27.41,27.41,0,0,0,4.81,1.78c.84.22,1.69.41,2.57.55A27.22,27.22,0,0,0,54.09,22.77ZM27.22,52.69a24.89,24.89,0,0,1-2.88-.17,26.07,26.07,0,0,1-2.67-.44,25.2,25.2,0,0,1-4.94-1.67c-.71-.32-1.39-.67-2.06-1A25.48,25.48,0,0,1,10.06,46c-.28-.26-.56-.53-.82-.8s-.5-.5-.74-.76a26.36,26.36,0,0,1-3.32-4.58q-.57-1-1-2.07A24.79,24.79,0,0,1,2.4,32.43,22.28,22.28,0,0,1,2,29.71a22.9,22.9,0,0,1-.11-2.36A25.34,25.34,0,0,1,27.22,2c.8,0,1.59,0,2.37.11a26.79,26.79,0,0,1,2.71.4,25.65,25.65,0,0,1,5.36,1.74c.71.32,1.4.67,2.06,1A25,25,0,0,1,44.3,8.63c.26.24.52.48.77.74s.53.53.79.81a25.53,25.53,0,0,1,3.38,4.61c.38.67.73,1.36,1,2.06A24.62,24.62,0,0,1,52,21.8a25.88,25.88,0,0,1,.44,2.66,25.06,25.06,0,0,1,.17,2.89A25.33,25.33,0,0,1,27.22,52.69Z" /><path className="cls-1" d="M50.29,26.56A22.53,22.53,0,0,0,50,23.71a22.35,22.35,0,0,0-2.42-7.29,23.34,23.34,0,0,0-3.29-4.7c-.26-.28-.52-.55-.79-.82s-.51-.5-.76-.73a23.64,23.64,0,0,0-4.63-3.28A21.44,21.44,0,0,0,36,5.9a22.9,22.9,0,0,0-8.47-1.74h-.33A23.06,23.06,0,0,0,4.16,27.23v.32a22.84,22.84,0,0,0,.22,2.89A23.18,23.18,0,0,0,5.89,36c.3.72.63,1.42,1,2.11a23.64,23.64,0,0,0,3.28,4.63c.23.26.48.52.73.76s.55.53.83.79a23,23,0,0,0,4.68,3.3c.69.36,1.4.69,2.12,1a23.35,23.35,0,0,0,8,1.68h.66A23.07,23.07,0,0,0,50.3,27.23C50.3,27,50.29,26.79,50.29,26.56ZM6.43,28.4c0-.39,0-.78,0-1.17,0-.68,0-1.35.1-2A20.84,20.84,0,0,1,25.22,6.49c.66-.06,1.33-.1,2-.1.4,0,.79,0,1.17,0l-8.23,8.23a4.19,4.19,0,0,0-7.82,2.08,4.18,4.18,0,0,0,2.11,3.64ZM18.08,46a20.31,20.31,0,0,1-4.77-3.22c-.29-.25-.56-.51-.83-.78l9.9-9.9a6.69,6.69,0,0,1-.19-9.2L8.56,36.48a17.54,17.54,0,0,1-.93-2.19L34.29,7.63a17.54,17.54,0,0,1,2.19.93L22.64,22.4a6.69,6.69,0,0,1,9.2.19l10.1-10.1c.28.27.54.54.79.83A21,21,0,0,1,46,18.09Zm2.19.93,26.59-26.6A20.25,20.25,0,0,1,48,25.75l-10,10a2.09,2.09,0,0,1,1.56,1.55,2,2,0,0,1,.06.5,2.11,2.11,0,0,1-2.12,2.11,2,2,0,0,1-.49-.06,2.12,2.12,0,0,1-1.56-1.56L25.74,48A21,21,0,0,1,20.27,46.88Z" /><path className="cls-1" d="M35.88,27.39a8.77,8.77,0,0,1-15,6.16l12.41-12.4A8.78,8.78,0,0,1,35.88,27.39Z" /></g></g></g></g></svg>
    </SvgIcon>
  );
};

export default LogoIcon;
