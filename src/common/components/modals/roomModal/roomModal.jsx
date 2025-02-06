import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, InputLabel, OutlinedInput, Switch, Grid, FormControlLabel, FormLabel, Box, Typography, Select, MenuItem, Checkbox } from '@mui/material';

import moneyMask from '../../../masks/moneyMask';
import roomService from '../../../../domains/room/roomService';

import { formatRoomPayload, validationSchema } from './roomModal.constants';

const RoomModal = (props) => {
    const { open, setOpen, valuesLine } = props;
    const { businessId } = useSelector((state) => state?.auth.user) || { businessId: undefined };

    const formik = useFormik({
        initialValues: {
            name: valuesLine?.name || '',
            price: valuesLine ? moneyMask(valuesLine.price) : 'R$ 0,00',
            status: valuesLine?.status ?? true,
            capacity: valuesLine?.capacity || 0,
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => handleSubmit(values)
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (values) => {
        const formattedValues = {
            ...values,
            price: parseInt(values.price.replace(/\D/g, ''), 10) || 0
        };
        if (valuesLine) {
            roomService.update(valuesLine.id, formatRoomPayload(formattedValues));
        } else {
            roomService.create(businessId, formatRoomPayload(formattedValues));
        }

        formik.resetForm();
        setOpen(false);
    };
    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">{valuesLine ? 'Editar sala' : 'Nova sala'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', m: 'auto', pt: 2, gap: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="name" size="small">
                                        Nome
                                    </InputLabel>
                                    <OutlinedInput
                                        id="name"
                                        label="Nome"
                                        size="small"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.name}
                                        </Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="capacity" size="small">
                                        Capacidade
                                    </InputLabel>
                                    <OutlinedInput
                                        id="capacity"
                                        label="Capacidade"
                                        size="small"
                                        type="number"
                                        value={formik.values.capacity}
                                        onChange={formik.handleChange}
                                        error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                                    />
                                    {formik.touched.capacity && formik.errors.capacity ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.capacity}
                                        </Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="price" size="small">
                                        Taxa
                                    </InputLabel>
                                    <OutlinedInput
                                        id="price"
                                        label="Preço"
                                        size="small"
                                        value={formik.values.price}
                                        onChange={(e) => {
                                            const maskedValue = moneyMask(e.target.value);
                                            formik.setFieldValue('price', maskedValue);
                                        }}
                                        error={formik.touched.price && Boolean(formik.errors.price)}
                                    />
                                    {formik.touched.price && formik.errors.price ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.price}
                                        </Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>


                            <Grid item xs={4}>
                                <FormControl>
                                    <FormLabel component="legend">Status</FormLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                name="status"
                                                checked={formik.values.status}
                                                onChange={(e) => formik.setFieldValue('status', e.target.checked)}
                                                error={formik.touched.status && formik.errors.status}
                                            />
                                        }
                                        label={formik.values.status ? 'Ativo' : 'Inativo'}
                                    />
                                </FormControl>
                            </Grid>

                            
                        </Grid>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                {valuesLine ? 'Editar sala' : 'Cadastrar sala'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RoomModal;
