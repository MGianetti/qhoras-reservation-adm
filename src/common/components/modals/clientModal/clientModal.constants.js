import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required('Digite o nome do cliente.'),
    phone: Yup.string().required('Digite o telefone do cliente.')
});
