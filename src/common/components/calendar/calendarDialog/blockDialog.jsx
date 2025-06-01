import clsx from 'clsx';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { ptBR } from 'date-fns/locale';
import { IoMdTime } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useContext, useState } from 'react';
import { CalendarContext } from '../context/calendar-context';
import { Button, Dialog, Typography, DialogTitle, FormControl, DialogContent, DialogActions, Grid, Box, DialogContentText, useMediaQuery, useTheme } from '@mui/material';

import appointmentService from '../../../../domains/appointment/appointmentService';

import { StyledDialog, classes } from './calendarDialog.constants';
import calendarBlocksService from '../../../../domains/calendarBlocks/calendarBlocksService';

function BlockDialog() {
    const { stateCalendar, setStateCalendar } = useContext(CalendarContext);
    const { eventID = 0, eventBeginDate, eventEndDate, blockDialogOpen } = stateCalendar;

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const handleCloseDialog = () => {
        setStateCalendar({ ...stateCalendar, blockDialogOpen: false });
    };

    const initialTime = format(new Date(eventBeginDate), 'HH:mm');
    const endTime = format(new Date(eventEndDate), 'HH:mm');

    const formik = useFormik({
        initialValues: {},
        enableReinitialize: true,
        onSubmit: () => setOpenDeleteConfirm(true)
    });

    const handleClose = () => {
        handleCloseDialog();
        setOpenDeleteConfirm(false);
    };

    const handleDelete = () => {
        calendarBlocksService.remove(eventID);

        handleCloseDialog();
        setOpenDeleteConfirm(false);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
    };

    return (
        <>
            <StyledDialog maxWidth="sm" fullWidth={true} open={blockDialogOpen} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10
                        }}
                    >
                        Bloqueio de horário
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            pt: 2,
                            gap: 3
                        }}
                    >
                        <FormControl className={clsx(classes.formControl, classes.formControlFlex)}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={8} style={{ paddingBlock: 15 }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <Typography>Data do bloqueio</Typography>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Typography>
                                                {' '}
                                                {format(new Date(eventBeginDate), 'dd/MM/yyyy', {
                                                    locale: ptBR
                                                })}{' '}
                                                -{' '}
                                                {format(new Date(eventEndDate), 'eeee', {
                                                    locale: ptBR
                                                })}
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                    style={{
                                        display: 'flex',
                                        justifyContent: isSmUp ? 'flex-end' : 'flex-start',
                                        paddingBlock: 15
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <Typography>Horário</Typography>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <Typography
                                                sx={{
                                                    color: '#7c7c7c',
                                                    border: '1px solid #bebebe',
                                                    padding: '8px 10px',
                                                    borderRadius: 1
                                                }}
                                            >
                                                {initialTime}
                                            </Typography>
                                            -
                                            <Typography
                                                sx={{
                                                    color: '#7c7c7c',
                                                    border: '1px solid #bebebe',
                                                    padding: '8px 10px',
                                                    borderRadius: 1
                                                }}
                                            >
                                                {endTime}
                                            </Typography>
                                            <IoMdTime />
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </FormControl>

                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                Excluir
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </StyledDialog>

            <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{'Confirmar exclusão'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Você tem certeza que deseja excluir este bloqueio? Esta ação não pode ser desfeita.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm}>Cancelar</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Confirmar exclusão
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default BlockDialog;
