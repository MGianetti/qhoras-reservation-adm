import { CardMedia, Paper, Stack, Typography } from "@mui/material";

import loginPage1 from "src/assets/images/login-page-1.png";
import loginPage2 from "src/assets/images/login-page-2.png";

import styles from "./halfScreenLogin.module.scss";
import { Trans } from "@lingui/react/macro";

const HalfScreenLogin = () => {
  const getRandomNumber = () => Math.floor(Math.random() * 2) + 1;
  const images = {
    1: loginPage1,
    2: loginPage2,
  };
  const selectedImage = images[getRandomNumber()];
  return (
    <Paper sx={{ position: "relative" }}>
      <CardMedia
        component="img"
        sx={{
          height: "100vh",
          filter: "opacity(0.8) hue-rotate(200deg)",
        }}
        image={selectedImage}
        alt="Imagem de Login"
      />
      <Stack className={styles.stackTitle}>
        <Typography variant="h4" sx={{ py: 1, fontWeight: 700 }}>
          <Trans>Organize suas reuniões e eventos</Trans>, <br />
          <Trans>com facilidade e eficiência</Trans>
        </Typography>
        <Typography variant="subtitle1">
          Gerencie suas reservas de salas com a QHoras!
        </Typography>
      </Stack>
    </Paper>
  );
};

export default HalfScreenLogin;
