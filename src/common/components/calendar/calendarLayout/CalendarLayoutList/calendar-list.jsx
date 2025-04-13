import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useState, useMemo, useContext } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Box,
} from "@mui/material";

import { CalendarContext } from "../../context/calendar-context";
import DeleteRoomModal from "../../../modals/deleteRoomModal/deleteRoomModal";
import { RenderRowCalendarList } from "./renderRowCalendarList/renderRowCalendarList";
import appointmentService from "../../../../../domains/appointment/appointmentService";

import { columnsCalendarList, rowsCalendarList } from "./calendar-list.constants";

const CalendarLayoutList = () => {
  const theme = useTheme();

  const { businessId } = useSelector((state) => state?.auth.user) || {};
  const {
    data: reservations = [],
    pageData: { totalCount = 0, page: pageAppointments = 0 } = {
      totalCount: 0,
      page: 0,
    },
  } = useSelector((state) => state?.appointments) || {};

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowValues, setDeleteRowValues] = useState(null);
  const { stateCalendar, setStateCalendar } = useContext(CalendarContext);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");

  const fetchCalendarList = useCallback(async () => {
    if (businessId) {
      await appointmentService.readCalendarList({
        businessId,
        page: page + 1,
        limit: rowsPerPage,
        order,
        orderBy:
          orderBy === "member"
            ? "client.name"
            : orderBy === "room"
            ? "room.name"
            : orderBy,
      });
    }
  }, [businessId, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    fetchCalendarList();
  }, [fetchCalendarList]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (pageAppointments === 1) {
      setPage(0);
    }
  }, [pageAppointments]);

  const handleClickLine = (rowData) => {
    console.log(rowData);
    setStateCalendar({
      ...stateCalendar,
      openDialog: true,
      
    });
    // Implemente a ação desejada ao clicar na linha
  };

  const handleOpenDeleteModal = (e, rowValues) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
    setDeleteRowValues(rowValues);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const formattedRows = useMemo(
    () => rowsCalendarList(reservations),
    [reservations]
  );

  return (
    <>
      <Paper
        sx={{ width: "100%", overflow: "hidden", boxShadow: theme.shadows[0] }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columnsCalendarList.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "unset",
                    }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={{ visibility: "hidden" }}>
                          {order === "desc"
                            ? "ordenado decrescente"
                            : "ordenado crescente"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedRows.map((row, rowIndex) => (
                <RenderRowCalendarList
                  key={rowIndex}
                  row={row}
                  columns={columnsCalendarList}
                  handleClickLine={() => handleClickLine(reservations[rowIndex])}
                  unformattedData={reservations}
                  rowIndex={rowIndex}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={totalCount || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
        />
      </Paper>

      <DeleteRoomModal
        isOpen={deleteModalOpen}
        deleteRowValues={deleteRowValues}
        handleClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default CalendarLayoutList;
