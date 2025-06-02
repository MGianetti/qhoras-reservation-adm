import { useState } from 'react';
import { Grid } from '@mui/material';

import RoomsList from './roomsList/roomList';
import RoomModal from '../../common/components/modals/roomModal/roomModal';
import ListActionsBar from '../../common/components/listActionsBar/listActionsBar';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';
import LoadingOverlay from '../../common/components/LoadingOverlay/LoadingOverlay';
import { useSelector } from 'react-redux';
import { Trans } from '@lingui/react/macro';

const Rooms = () => {
    const [open, setOpen] = useState(false);
    const [valuesLine, setValuesLine] = useState(null);
    const [search, setSearch] = useState('');
    const isLoading = useSelector((state) => state?.rooms.isLoading);

    return (
        <LoggedLayout>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ListActionsBar handleOpen={setOpen} setValuesLine={setValuesLine} icon="plus" labelSearch={<Trans>Pesquisar Salas</Trans>} setSearch={setSearch} />
                </Grid>
                <Grid item xs={12}>
                    <LoadingOverlay isLoading={isLoading} />
                    <RoomsList handleOpenModal={setOpen} setValuesLine={setValuesLine} search={search} />
                </Grid>
            </Grid>
            <RoomModal open={open} setOpen={setOpen} valuesLine={valuesLine} setValuesLine={setValuesLine} />
        </LoggedLayout>
    );
};

export default Rooms;
