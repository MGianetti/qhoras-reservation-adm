import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, InputLabel, OutlinedInput, Switch, Grid, FormControlLabel, FormLabel, Box, Typography, Select, MenuItem, Checkbox } from '@mui/material';

import moneyMask from '../../../masks/moneyMask';
import servicesService from '../../../../domains/services/servicesService';

import { formatServicePayload, validationSchema } from './serviceModal.constants';

const ServiceModal = (props) => {
    const { open, setOpen, valuesLine } = props;
    const { id: businessId } = useSelector((state) => state?.auth.user) || { businessId: undefined };

    const formik = useFormik({
        initialValues: {
            name: valuesLine?.name || '',
            price: valuesLine ? moneyMask(valuesLine.price) : 'R$ 0,00',
            status: valuesLine?.status ?? true,
            duration: valuesLine?.duration || '',
            loyaltyPoints: valuesLine?.loyaltyPoints || 0,
            startingFrom: valuesLine?.startingFrom
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
            servicesService.update(valuesLine.id, formatServicePayload(formattedValues));
        } else {
            servicesService.create(businessId, formatServicePayload(formattedValues));
        }

        formik.resetForm();
        setOpen(false);
    };
    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">{valuesLine ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', m: 'auto', pt: 2, gap: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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

                            <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="price" size="small">
                                        Preço
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
                                    <FormLabel component="legend">A partir de</FormLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                name="startingFrom"
                                                checked={formik.values.startingFrom}
                                                onChange={(e) => formik.setFieldValue('startingFrom', e.target.checked)}
                                                error={formik.touched.startingFrom && formik.errors.startingFrom}
                                            />
                                        }
                                        label={formik.values.startingFrom ? 'Sim' : 'Não'}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="duration" size="small">
                                        Tempo
                                    </InputLabel>
                                    <Select
                                        labelId="duration-select-label"
                                        id="duration"
                                        label="Tempo"
                                        size="small"
                                        value={formik.values.duration}
                                        onChange={(e) => formik.setFieldValue('duration', e.target.value)}
                                        error={formik.touched.duration && Boolean(formik.errors.duration)}
                                    >
                                        {Array.from({ length: 288 }, (_, i) => {
                                            const hours = Math.floor(i / 12);
                                            const minutes = (i % 12) * 5;
                                            const value = hours * 60 + minutes;
                                            const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                            return (
                                                <MenuItem key={value} value={value}>
                                                    {label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    {formik.touched.duration && formik.errors.duration ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.duration}
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

                            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="loyaltyPoints" size="small">
                                        Pts Fidelidade
                                    </InputLabel>
                                    <OutlinedInput
                                        id="loyaltyPoints"
                                        label="Pts Fidelidade"
                                        size="small"
                                        type="number"
                                        value={formik.values.loyaltyPoints}
                                        onChange={formik.handleChange}
                                        error={formik.touched.loyaltyPoints && Boolean(formik.errors.loyaltyPoints)}
                                    />
                                    {formik.touched.loyaltyPoints && formik.errors.loyaltyPoints ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.loyaltyPoints}
                                        </Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                {valuesLine ? 'Editar Serviço' : 'Cadastrar Serviço'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ServiceModal;