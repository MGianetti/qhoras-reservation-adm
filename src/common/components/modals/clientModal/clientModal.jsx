import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, Box, InputLabel, OutlinedInput, Typography, Grid } from '@mui/material';

import phoneMask from '../../../masks/phoneMask';
import clientService from '../../../../domains/client/clientService';
import { validationSchema } from './clientModal.constants';

const ClientModal = (props) => {
    const { open, setOpen, valuesLine } = props;

    const { businessId } = useSelector((state) => state?.auth.user) || {
        businessId: undefined
    };

    const formik = useFormik({
        initialValues: {
            name: valuesLine?.name || '',
            phoneNumber: phoneMask(valuesLine?.phoneNumber) || '',
            email: valuesLine?.email || ''
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => handleSubmit(values)
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (values) => {
        const phoneOnlyNumbers = values.phoneNumber.replace(/\D/g, '');
        const trimmedEmail = (values.email || '').trim();
        const payload = {
            ...values,
            phoneNumber: phoneOnlyNumbers,
            email: trimmedEmail || null
        };

        if (valuesLine) {
            clientService.update(valuesLine.id, payload);
        } else {
            clientService.create(businessId, payload);
        }
        formik.resetForm();
        setOpen(false);
    };

    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">{valuesLine ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
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
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="name" size="small">
                                        Nome
                                    </InputLabel>
                                    <OutlinedInput
                                        id="name"
                                        name="name"
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

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="phoneNumber" size="small">
                                        Telefone
                                    </InputLabel>
                                    <OutlinedInput
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        label="Telefone"
                                        size="small"
                                        value={formik.values.phoneNumber}
                                        inputProps={{ maxLength: 15 }}
                                        onChange={(e) => formik.setFieldValue('phoneNumber', phoneMask(e.target.value))}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    />
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.phoneNumber}
                                        </Typography>
                                    ) : null}
                                </FormControl>
                            </Grid>

                            {/* E-mail (opcional) */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="email" size="small">
                                        E-mail (opcional)
                                    </InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        label="E-mail (opcional)"
                                        size="small"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.email}
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
                                {valuesLine ? 'Editar Membro' : 'Cadastrar Membro'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientModal;
