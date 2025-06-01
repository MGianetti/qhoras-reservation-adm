import { Trans } from '@lingui/react/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    email: Yup.string()
        .email(Trans`Digite um email válido`)
        .required(Trans`O email é obrigatório`),
    password: Yup.string()
        .min(8, Trans`A senha deve ter no mínimo 8 caracteres`)
        .required(Trans`A senha é obrigatória`)
});
