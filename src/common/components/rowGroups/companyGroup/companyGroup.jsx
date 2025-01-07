import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Button, FormControl, FormGroup, FormLabel, InputLabel, OutlinedInput } from '@mui/material';
import userService from '../../../../domains/user/userService';

const CompanyGroup = () => {
    const { id, insideBusinessName, address, whatsappNumber } = useSelector((state) => state?.auth.user) || { email: undefined };

    const handleSubmit = (values) => {
        const companyData = {
            companyName: values.companyName,
            phone: values.phone,
            address: values.address
        };

        userService.updateCompany(id, companyData);
    };

    const formik = useFormik({
        initialValues: {
            companyName: insideBusinessName || '',
            phone: whatsappNumber || '',
            address: address || ''
        },
        enableReinitialize: true,
        onSubmit: (values) => handleSubmit(values)
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
                Empresa
            </FormLabel>
            <FormGroup sx={{ gap: 2 }}>
                <FormControl>
                    <InputLabel htmlFor="companyName" size="small">
                        Nome da empresa
                    </InputLabel>
                    <OutlinedInput id="companyName" label="Nome da empresa" size="small" value={formik.values.companyName} onChange={(e) => formik.setFieldValue('companyName', e.target.value)} />
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="phone" size="small">
                        Telefone
                    </InputLabel>
                    <OutlinedInput id="phone" label="Telefone" size="small" value={formik.values.phone} onChange={(e) => formik.setFieldValue('phone', e.target.value)} />
                </FormControl>

                <FormControl>
                    <InputLabel htmlFor="address" size="small">
                        Endereço
                    </InputLabel>
                    <OutlinedInput id="address" label="Endereço" size="small" value={formik.values.address} onChange={(e) => formik.setFieldValue('address', e.target.value)} />
                </FormControl>
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
                    Salvar
                </Button>
            </div>
        </form>
    );
};

export default CompanyGroup;
