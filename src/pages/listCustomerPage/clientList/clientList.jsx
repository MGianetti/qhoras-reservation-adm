import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { i18n } from '@lingui/core';
import { defineMessage } from '@lingui/core/macro';

import clientService from '../../../domains/client/clientService';
import { RenderRowClientList } from './renderRowClientList/renderRowClientList';
import { columns, getRandomImage } from './clientList.constants';
import { useDebounce } from '../../../common/utils/useDebounce';

const ClientList = (props) => {
    const { handleOpenModal, setValuesLine, search } = props;
    const theme = useTheme();

    const { businessId } = useSelector((state) => state?.auth.user) || { businessId: undefined };
    const { data: clientList, pagination } = useSelector((state) => state?.clients) || { data: [], pagination: {} };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setPage(0);
    }, [search]);

    const fetchClients = useCallback(async () => {
        if (businessId) {
            await clientService.read({
                businessId,
                page: page + 1,
                limit: rowsPerPage,
                search: debouncedSearch
            });
        }
    }, [businessId, page, rowsPerPage, debouncedSearch]);

    useEffect(() => {
        fetchClients();
    }, [debouncedSearch, page, rowsPerPage, fetchClients]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (pagination.page === 1) {
            setPage(0);
        }
    }, [pagination.page]);

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    // Helper to format last reservation
    const formatLastReservation = (date) => {
        if (!date) {
            return i18n._(
                defineMessage({
                    id: 'clients.noReservations',
                    message: 'Sem reservas'
                })
            );
        }
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: theme.shadows[0] }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        backgroundColor: 'unset'
                                    }}
                                >
                                    {i18n._(column.label)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientList.map((client, rowIndex) => {
                            const row = {
                                image: getRandomImage(),
                                name: client.name,
                                phone: client.phoneNumber,
                                lastReservation: formatLastReservation(client.lastReservationDate),
                                loyaltyPoints: client.loyaltyPoints,
                                rawData: client
                            };
                            return (
                                <RenderRowClientList
                                    key={rowIndex}
                                    row={row}
                                    columns={columns}
                                    rowIndex={rowIndex}
                                    handleOpenModal={handleOpenModal}
                                    setValuesLine={setValuesLine}
                                    unformattedData={clientList}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={pagination.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
            />
        </Paper>
    );
};

export default ClientList;
