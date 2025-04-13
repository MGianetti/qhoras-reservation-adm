import { enqueueSnackbar, closeSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import { IoClose } from "react-icons/io5";

const notification = (notification) => {
  enqueueSnackbar(notification.message, {
    variant: notification.type,
    autoHideDuration: 3000,
    action: (snackbarId) => (
      <IconButton
        aria-label="close"
        color="inherit"
        onClick={() => closeSnackbar(snackbarId)}
      >
        <IoClose />
      </IconButton>
    ),
  });
};

export default notification;
