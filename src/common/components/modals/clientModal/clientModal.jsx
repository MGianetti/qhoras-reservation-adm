import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, Box, InputLabel, OutlinedInput, Rating, Typography } from '@mui/material';

import phoneMask from '../../../masks/phoneMask';
import clientService from '../../../../domains/client/clientService';

import { validationSchema } from './clientModal.constants';

const ClientModal = (props) => {
    const { open, setOpen, valuesLine } = props;

    const { id: businessId } = useSelector((state) => state?.auth.user) || { businessId: undefined };

    const formik = useFormik({
        initialValues: {
            name: valuesLine?.name || '',
            phone: phoneMask(valuesLine?.phone) || '',
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => handleSubmit(values)
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (values) => {
        if (valuesLine) {
            clientService.update(valuesLine.id, values);
        } else {
            clientService.create(businessId, values);
        }
        formik.resetForm();
        setOpen(false);
    };

    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">{valuesLine ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', m: 'auto', pt: 2, gap: 3 }}>
                        <FormControl>
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

                        <FormControl>
                            <InputLabel htmlFor="phone" size="small">
                                Telefone
                            </InputLabel>
                            <OutlinedInput
                                id="phone"
                                name="phone"
                                label="Telefone"
                                size="small"
                                value={formik.values.phone}
                                inputProps={{ maxLength: 15 }}
                                onChange={(e) => formik.setFieldValue('phone', phoneMask(e.target.value))}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                                <Typography variant="caption" color="error">
                                    {formik.errors.phone}
                                </Typography>
                            ) : null}
                        </FormControl>

                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                {valuesLine ? 'Editar Dados' : 'Cadastrar Membro'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientModal;
