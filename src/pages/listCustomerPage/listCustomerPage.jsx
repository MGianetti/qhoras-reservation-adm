import { useState } from 'react';
import { Grid } from '@mui/material';

import ClientList from './clientList/clientList';
import ClientModal from '../../common/components/modals/clientModal/clientModal';
import ListActionsBar from '../../common/components/listActionsBar/listActionsBar';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';
import LoadingOverlay from '../../common/components/LoadingOverlay/LoadingOverlay';
import { useSelector } from 'react-redux';

const ListCustomerPage = () => {
    const [open, setOpen] = useState(false);
    const [valuesLine, setValuesLine] = useState(null);
    const [search, setSearch] = useState('');
    // const isLoading = useSelector((state) => state?.clients.isLoading);
    const isLoading = false;
    return (
        <LoggedLayout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ListActionsBar handleOpen={setOpen} setValuesLine={setValuesLine} icon="addClient" labelSearch={Trans`Pesquisar membros`} setSearch={setSearch} />
                </Grid>
                <Grid item xs={12}>
                    <LoadingOverlay isLoading={isLoading} />
                    <ClientList handleOpenModal={setOpen} setValuesLine={setValuesLine} search={search} />
                </Grid>
            </Grid>
            <ClientModal open={open} setOpen={setOpen} valuesLine={valuesLine} />
        </LoggedLayout>
    );
};

export default ListCustomerPage;
