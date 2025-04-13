import { Button, Chip, Grid, Stack, TableCell, TableRow } from "@mui/material";
import { IoTrash } from "react-icons/io5";

const RenderRoomCell = ({ column, value, handleOpenDeleteModal }) => {
  if (column.id === "status") {
    return (
      <Stack direction="row" justifyContent="center" spacing={1}>
        <Chip
          label={value ? "Ativo" : "Inativo"}
          sx={{
            backgroundColor: value ? "#05C00C" : "#C00505",
            color: "white",
            height: "unset",
            fontWeight: "bold",
            borderRadius: "8px",
            paddingBlock: "2px",
          }}
        />
      </Stack>
    );
  }

  if (column.id === "price") {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
    return formattedPrice;
  }
  if (column.id === "duration") {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, "0")}`;
    } else if (minutes === 1) {
      return `${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  }

  if (column.id === "actions") {
    return (
      <Grid container justifyContent="center" spacing={1}>
        <Grid item>
          <Button
            sx={{
              p: 1,
              minWidth: "unset",
              borderRadius: "50%",
              backgroundColor: "#C00505",
              "&:hover": { backgroundColor: "#C00505" },
            }}
            onClick={handleOpenDeleteModal}
          >
            <IoTrash color="#fff" size={20} />
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (column.format && typeof value === "number") {
    return column.format(value);
  }

  return value;
};

export const RenderRowRoomsList = ({
  row,
  columns,
  handleClickLine,
  unformattedData,
  rowIndex,
  handleOpenDeleteModal,
}) => {
  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      onClick={() => handleClickLine(unformattedData[rowIndex])}
      key={row.id}
    >
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell key={column.id} align={column.align}>
            <RenderRoomCell
              column={column}
              value={value}
              handleOpenDeleteModal={(e) =>
                handleOpenDeleteModal(e, unformattedData[rowIndex])
              }
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
