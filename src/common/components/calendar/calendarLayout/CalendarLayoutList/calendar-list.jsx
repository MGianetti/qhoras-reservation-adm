import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    PaginationItem
} from '@mui/material';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect, useCallback, useMemo, useContext } from 'react';

import { CalendarContext } from '../../context/calendar-context';
import LoadingOverlay from '../../../LoadingOverlay/LoadingOverlay';
import DeleteRoomModal from '../../../modals/deleteRoomModal/deleteRoomModal';
import { EnhancedTableToolbar } from './enhancedTableToolbar/enhancedTableToolbar';
import { RenderRowCalendarList } from './renderRowCalendarList/renderRowCalendarList';
import appointmentService from '../../../../../domains/appointment/appointmentService';
import calendarReadOnlyService from '../../../../../domains/calendarReadOnly/calendarReadOnlyService';

import { columnsCalendarList, rowsCalendarList } from './calendar-list.constants';

const CalendarLayoutList = () => {
    const theme = useTheme();
    const { businessId } = useSelector((state) => state.auth.user) || {};
    const { data: reservations = [], pageData: { totalCount = 0 } = {}, isLoading } = useSelector((state) => state.appointments) || {};

    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const location = useLocation();
    const queryBusinessId = new URLSearchParams(location.search).get('business');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteRowValues, setDeleteRowValues] = useState(null);

    const [params, setParams] = useState({
        page: 1,
        rowsPerPage: 10,
        order: 'desc',
        orderBy: 'createdAt',
        filters: {}
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / params.rowsPerPage));

    useEffect(() => {
        if (params.page > totalPages) {
            setParams((p) => ({ ...p, page: totalPages }));
        }
    }, [totalPages, params.page]);

    const fetchCalendarList = useCallback(async () => {
        const service = queryBusinessId ? calendarReadOnlyService : appointmentService;
        const bid = queryBusinessId || businessId;
        if (!bid) return;

        await service.readCalendarList({
            businessId: bid,
            page: params.page,
            limit: params.rowsPerPage,
            order: params.order,
            orderBy: params.orderBy === 'member' ? 'client.name' : params.orderBy === 'room' ? 'room.name' : params.orderBy,
            filters: params.filters
        });
    }, [businessId, queryBusinessId, params]);

    useEffect(() => {
        fetchCalendarList();
    }, [fetchCalendarList]);

    const handleChangePage = (_, newPage) => {
        setParams((p) => ({ ...p, page: newPage }));
    };
    const handleChangeRowsPerPage = (e) => {
        const value = parseInt(e.target.value, 10);
        setParams((p) => ({
            ...p,
            rowsPerPage: value,
            page: 1
        }));
    };
    const handleRequestSort = (_, property) => {
        setParams((p) => {
            const isAsc = p.orderBy === property && p.order === 'asc';
            return {
                ...p,
                order: isAsc ? 'desc' : 'asc',
                orderBy: property,
                page: 1
            };
        });
    };
    const handleApplyFilters = (newFilters) => {
        setParams((p) => ({
            ...p,
            filters: newFilters,
            page: 1
        }));
    };

    const handleClickLine = (rowData) => {
        const begin = new Date(rowData.begin);
        const end = new Date(rowData.end);
        setStateCalendar({
            ...stateCalendar,
            openDialog: true,
            eventBeginDate: begin,
            eventBeginTime: {
                value: format(begin, 'H:mm', { locale: ptBR }),
                label: format(begin, 'H:mm', { locale: ptBR })
            },
            eventEndDate: end,
            eventEndTime: {
                value: format(end, 'H:mm', { locale: ptBR }),
                label: format(end, 'H:mm', { locale: ptBR })
            },
            room: rowData.room.id,
            client: rowData.client.id,
            clientName: rowData.client.name,
            status: rowData.status,
            name: rowData.name,
            description: rowData.description,
            isPaid: rowData.isPaid,
            eventID: rowData.id,
            calendarEvent: rowData,
            isList: true,
            updateParams: {
                businessId,
                page: params.page,
                limit: params.rowsPerPage,
                order: params.order,
                orderBy: params.orderBy === 'member' ? 'client.name' : params.orderBy === 'room' ? 'room.name' : params.orderBy
            }
        });
    };

    const formattedRows = useMemo(() => rowsCalendarList(reservations), [reservations]);

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: theme.shadows[0] }}>
                <EnhancedTableToolbar handleApplyFilters={handleApplyFilters} />

                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columnsCalendarList.map((col) => (
                                    <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }} sortDirection={params.orderBy === col.id ? params.order : false}>
                                        <TableSortLabel
                                            active={params.orderBy === col.id}
                                            direction={params.orderBy === col.id ? params.order : 'asc'}
                                            onClick={(e) => handleRequestSort(e, col.id)}
                                        >
                                            {col.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {formattedRows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columnsCalendarList.length} align="center">
                                        Nenhum registro encontrado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                formattedRows.map((row, i) => (
                                    <RenderRowCalendarList
                                        key={i}
                                        row={row}
                                        columns={columnsCalendarList}
                                        handleClickLine={() => handleClickLine(reservations[i])}
                                        unformattedData={reservations}
                                        rowIndex={i}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        gap: 2
                    }}
                >
                    <Tooltip>
                        <FormControl size="small" fullWidth sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 150 } }}>
                            <InputLabel>Registros por página</InputLabel>
                            <Select
                                value={params.rowsPerPage}
                                label="Registros por página"
                                onChange={handleChangeRowsPerPage}
                                sx={{
                                    textAlign: 'center',
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }
                                }}
                            >
                                {[10, 25, 50, 100].map((n) => (
                                    <MenuItem key={n} value={n}>
                                        {n}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Tooltip>

                    <Pagination
                        count={totalPages}
                        page={params.page}
                        onChange={handleChangePage}
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        color="primary"
                        renderItem={(item) => {
                            const titles = {
                                first: 'Primeira página',
                                previous: 'Página anterior',
                                next: 'Próxima página',
                                last: 'Última página'
                            };
                            const title = titles[item.type] ?? `Página ${item.page}`;
                            return (
                                <Tooltip title={title}>
                                    <PaginationItem {...item} />
                                </Tooltip>
                            );
                        }}
                    />
                </Box>
            </Paper>

            <DeleteRoomModal isOpen={deleteModalOpen} deleteRowValues={deleteRowValues} handleClose={() => setDeleteModalOpen(false)} />
        </>
    );
};

export default CalendarLayoutList;
