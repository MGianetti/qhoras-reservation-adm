import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required('Digite o nome do cliente.'),
    phoneNumber: Yup.string().required('Digite o telefone do cliente.'),
    email: Yup.string()
        .trim()
        .transform((v, o) => (o === '' ? null : v))
        .nullable()
        .email('E-mail inválido.')
});
