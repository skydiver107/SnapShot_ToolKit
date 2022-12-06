import React, { Fragment, useEffect, useRef, useState } from "react";

import Button, { ButtonProps } from '@mui/material/Button';
import Typography from "@mui/material/Typography";

interface PaperButtonProps extends ButtonProps {
  selected?: boolean,
  children?: React.ReactNode
}

const PaperButton = (props: PaperButtonProps) => {
  const { selected, children, ...attrs } = props;
  return (
    <Button
      {...attrs}
      variant={`outlined`}
      sx={{
        ...attrs.sx,
        boxShadow: `none`,
        border: `none`,
        textTransform: `inherit`,
        background: theme => (selected ? theme.palette.neutral.paper : theme.palette.neutral.contrast),
        color: theme => (selected ? theme.palette.text.primary : theme.palette.common.white),
        '&:hover': {
          background: theme => (false ? theme.palette.neutral.contrast : theme.palette.neutral.paper),
          color: theme => (false ? theme.palette.common.white : theme.palette.text.primary),
          boxShadow: `none`,
          border: `none`,
        },
        p: 1.5
      }}
    >
      {children}
    </Button>
  )
}

export default PaperButton;