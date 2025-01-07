import { useState } from 'react';
import { Grid } from '@mui/material';

import ServicesList from './servicesList/servicesList';
import ServiceModal from '../../common/components/modals/serviceModal/serviceModal';
import ListActionsBar from '../../common/components/listActionsBar/listActionsBar';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';
import LoadingOverlay from '../../common/components/LoadingOverlay/LoadingOverlay';
import { useSelector } from 'react-redux';

const Rooms = () => {
    const [open, setOpen] = useState(false);
    const [valuesLine, setValuesLine] = useState(null);
    const [search, setSearch] = useState('');
    const isLoading = useSelector((state) => state?.services.isLoading);

    return (
        <LoggedLayout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ListActionsBar handleOpen={setOpen} setValuesLine={setValuesLine} icon="addService" labelSearch="Pesquisar Serviços" setSearch={setSearch} />
                </Grid>
                <Grid item xs={12}>
                    <LoadingOverlay isLoading={isLoading} />
                    <ServicesList handleOpenModal={setOpen} setValuesLine={setValuesLine} search={search} />
                </Grid>
            </Grid>
            <ServiceModal open={open} setOpen={setOpen} valuesLine={valuesLine} setValuesLine={setValuesLine} />
        </LoggedLayout>
    );
};

export default Rooms;
