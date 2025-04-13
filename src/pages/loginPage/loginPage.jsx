import { Grid } from "@mui/material";

import LoginPageForm from "./loginPageForm/loginPageForm";
import HalfScreenLogin from "../../common/components/halfScreenLogin/halfScreenLogin";

function LoginPage() {
  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        md={6}
        sx={{ display: { xs: "none", sm: "none", md: "block" } }}
      >
        <HalfScreenLogin />
      </Grid>
      <Grid
        item
        md={6}
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          bgcolor: "#f3f5f8",
        }}
      >
        <LoginPageForm />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
