import React, { Fragment, useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';

import { handleImageError } from "src/common/utils/handleImageError";
import Typography from "@mui/material/Typography";

interface ImageWrapperProps {
 children?: React.ReactNode,
 src?: string,
 height?: string,
 text?: string
}

const ImageWrapper = (props: ImageWrapperProps) => {
 return (
  <Box
   component={`div`}
   sx={{
    width: `100%`,
    position: `relative`,
    overflow: `hidden`,
    paddingBottom: props.height || `100%`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`
   }}
  >
   <Stack
    component={`div`}
    alignItems={`center`}
    justifyContent={`center`}
    sx={{
     width: `100%`,
     bottom: 0,
     top: 0,
     left: 0,
     right: 0,
     position: `absolute`
    }}
   >
    <Box
     component={`img`}
     src={props.src}
     sx={{
      width: `100%`,
      height: `100%`,
      maxWidth: `100%`,
      verticalAlign: `middle`,
      backgroundColor: `transparent`,
      visibility: `visible`,
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
      objectFit: `cover`
     }}
     onError={handleImageError}
    />
   </Stack>
  </Box>
 )
}

export default ImageWrapper;