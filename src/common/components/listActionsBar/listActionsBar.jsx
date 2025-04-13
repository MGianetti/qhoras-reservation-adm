import { useTheme } from "@mui/styles";
import { Grid, Button } from "@mui/material";

import Icon from "../../../common/components/icon/Icon";
import SearchInput from "../../../common/components/searchInput/searchInput";

const ListActionsBar = (props) => {
  const { handleOpen, setValuesLine, icon, labelSearch, setSearch } = props;

  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        p: 2,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 1,
        gap: 2,
        boxShadow: theme.shadows[0],
      }}
    >
      <Grid item xs="auto">
        <Button
          type="submit"
          variant="contained"
          sx={{ p: 1, minWidth: "unset", borderRadius: 2 }}
          onClick={() => {
            setValuesLine(null);
            handleOpen(true);
          }}
        >
          <Icon name={icon} width={26} />
        </Button>
      </Grid>

      <Grid item xs>
        <SearchInput labelSearch={labelSearch} setSearch={setSearch} />
      </Grid>
    </Grid>
  );
};

export default ListActionsBar;
