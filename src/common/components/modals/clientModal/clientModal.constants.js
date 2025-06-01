import { Trans } from '@lingui/react/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required(Trans`Digite o nome do cliente.`),
    phoneNumber: Yup.string().required(Trans`Digite o telefone do cliente.`)
});
