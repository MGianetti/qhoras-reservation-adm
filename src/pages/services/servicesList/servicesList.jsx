import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

import servicesService from '../../../domains/services/servicesService';
import { RenderRowServicesList } from './renderRowServicesList/renderRowServicesList';
import { columns } from './servicesList.constants';
import DeleteServiceModal from '../../../common/components/modals/deleteServiceModal/deleteServiceModal';
import { clear } from '../../../domains/services/servicesSlice';

const ServicesList = (props) => {
    const { handleOpenModal, setValuesLine, search } = props;

    const dispatch = useDispatch();
    const theme = useTheme();

    const { id: businessId } = useSelector((state) => state?.auth.user) || {};
    const { data: servicesList, pagination } = useSelector((state) => state?.services) || { data: [], pagination: {} };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteRowValues, setDeleteRowValues] = useState(null);

    const fetchServices = useCallback(() => {
        if (businessId) {
            servicesService.read({businessId, page: page + 1, limit: rowsPerPage});
        }
    }, [businessId, page, rowsPerPage, dispatch]);
    
    useEffect(() => {
        dispatch(clear())
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickLine = (rowData) => {
        handleOpenModal(true);
        setValuesLine(rowData);
    };

    const handleOpenDeleteModal = (e, rowValues) => {
        e.stopPropagation();
        setDeleteModalOpen(true);
        setDeleteRowValues(rowValues);
    };

    const filteredList = useMemo(() => {
        const lowercasedSearch = search.trim().toLowerCase();
        return servicesList.filter((service) => service.name.toLowerCase().includes(lowercasedSearch));
    }, [servicesList, search]);

    const paginatedRows = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: theme.shadows[0] }}>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, backgroundColor: 'unset' }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRows.map((row, rowIndex) => (
                                <RenderRowServicesList
                                    key={rowIndex}
                                    row={row}
                                    columns={columns}
                                    handleClickLine={() => handleClickLine(row)}
                                    unformattedData={filteredList}
                                    rowIndex={rowIndex}
                                    handleOpenDeleteModal={(e) => handleOpenDeleteModal(e, row)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25]}
                    component="div"
                    count={pagination?.totalCount || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
                />
            </Paper>

            <DeleteServiceModal isOpen={deleteModalOpen} deleteRowValues={deleteRowValues} handleClose={() => setDeleteModalOpen(false)} />
        </>
    );
};

export default ServicesList;
