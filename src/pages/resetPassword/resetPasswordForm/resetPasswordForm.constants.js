import { Trans } from '@lingui/react/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    password: Yup.string()
        .required(Trans`Senha é obrigatória`)
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, Trans`A senha deve ter no mínimo 8 caracteres, contendo letras e números.`),
    confirmPassword: Yup.string()
        .required(Trans`Confirmação de senha é obrigatória`)
        .oneOf([Yup.ref(`password`)], Trans`As senhas não correspondem`)
});
