import { Stack, Typography } from "@mui/material";


export default function Custom404() {
  return (
    <Stack
      direction={`row`}
      alignItems={`center`}
      justifyContent={`center`}
      sx={{
        minHeight: `100vh`
      }}
    >
      <Typography
        variant={`h6`}
      >Coming soon...</Typography>
    </Stack>
  )
}