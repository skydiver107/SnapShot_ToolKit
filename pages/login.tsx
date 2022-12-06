import PaperButton from "@components/PaperButton";
import { Box, Typography, Stack } from '@mui/material';
import { useRouter } from "next/router";

import fetchData from "src/common/services/getDataWithAxios";
import { DATA_API } from "src/common/config";

export default function Login() {
  const router = useRouter();

  const callLogin = async () => {
    await fetchData({
      method: `get`,
      route: DATA_API.SIGN_IN
    });
  }

  return (
    <Stack
      direction={`row`}
      alignItems={`center`}
      justifyContent={`center`}
      sx={{
        minHeight: `100vh`
      }}
    >
      <PaperButton size={`medium`} selected={false}
        sx={{
          borderRadius: 1,
          mt: 2,
          px: `24px !important`,
          py: `8px !important`
        }}
        onClick={async () => {
          router.push(DATA_API.SIGN_IN);
        }}
      >
        <Typography
          variant={`subtitle2`}
        >
          Discord Login
        </Typography>
      </PaperButton>
    </Stack>
  )
}