import { defineMessage } from '@lingui/core/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required(
        defineMessage({
            id: 'validation.clientNameRequired',
            message: 'Digite o nome do cliente.'
        })
    ),
    phoneNumber: Yup.string().required(
        defineMessage({
            id: 'validation.clientPhoneRequired',
            message: 'Digite o telefone do cliente.'
        })
    )
});
