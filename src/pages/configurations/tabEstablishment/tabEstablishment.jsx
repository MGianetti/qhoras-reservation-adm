import { Grid } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useSelector } from "react-redux";

import CompanyGroup from "../../../common/components/rowGroups/companyGroup/companyGroup";
import WhatsappGroup from "../../../common/components/rowGroups/whatsappGroup/whatsappGroup";
import LoadingOverlay from "../../../common/components/LoadingOverlay/LoadingOverlay";

import styles from "./tabEstablishment.module.scss";

function TabEstablishment() {
  const theme = useTheme();
  const isLoading = useSelector((state) => state?.user.isLoading);
  return (
    <Grid container>
      <LoadingOverlay isLoading={isLoading} />
      <Grid
        item
        xs={12}
        sx={{ boxShadow: theme.shadows[0] }}
        className={styles.cardGroup}
      >
        <CompanyGroup />
      </Grid>

      {/* <Grid
        item
        xs={12}
        sx={{ mt: 2, boxShadow: theme.shadows[0] }}
        className={styles.cardGroup}
      >
        <WhatsappGroup />
      </Grid> */}
    </Grid>
  );
}

export default TabEstablishment;
