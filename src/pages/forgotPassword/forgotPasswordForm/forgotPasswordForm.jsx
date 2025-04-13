import { useState } from "react";
import { useTheme } from "@mui/styles";
import {
  Box,
  Button,
  CardMedia,
  FormControl,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import authService from "../../../infraestructure/auth/authService";

import logoB from "src/assets/images/logo-b.png";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const theme = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    authService.requestPasswordReset(email);
    setEmail("");
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 4,
        bgcolor: "#FFF",
        borderRadius: 2,
        width: 380,
        boxShadow: theme.shadows[0],
      }}
    >
      <Stack
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <CardMedia
          component="img"
          sx={{ width: 200 }}
          image={logoB}
          alt="Logo QHoras"
        />
        <Typography
          variant="subtitle2"
          sx={{ pt: 4, color: theme.palette.primary.main, fontSize: "1.5rem" }}
        >
          Recuperação de senha
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#606062", fontSize: "1rem" }}
        >
          Informe seu e-mail para solicitar uma nova senha!
        </Typography>
        <FormControl fullWidth sx={{ m: 2 }} variant="outlined">
          <InputLabel size="small" required htmlFor="email">
            Insira seu email de acesso
          </InputLabel>
          <OutlinedInput
            id="email"
            size="small"
            type="email"
            label="Insira seu email de acesso"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Resetar Senha
        </Button>
        <Link href="/" variant="subtitle2" sx={{ pt: 2 }}>
          Faça Login
        </Link>
      </Stack>
    </Box>
  );
};

export default ForgotPasswordForm;
