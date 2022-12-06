import { Box, Typography } from "@mui/material";


export default function Custom404() {
  return (
    <Box>
      <Typography
        variant={`subtitle1`}
        sx={{
          position: `absolute`,
          left: `50%`,
          top: `50%`,
          transform: `translate(-50%,-50%)`
        }}
      >404 - Page Not Found</Typography>
    </Box>
  )
}