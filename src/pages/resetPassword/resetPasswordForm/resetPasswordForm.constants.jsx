import { defineMessage } from '@lingui/core/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    password: Yup.string()
        .required(
            defineMessage({
                id: 'validation.passwordRequired2',
                message: 'Senha é obrigatória'
            })
        )
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            defineMessage({
                id: 'validation.passwordPattern',
                message: 'A senha deve ter no mínimo 8 caracteres, contendo letras e números.'
            })
        ),
    confirmPassword: Yup.string()
        .required(
            defineMessage({
                id: 'validation.confirmPasswordRequired',
                message: 'Confirmação de senha é obrigatória'
            })
        )
        .oneOf(
            [Yup.ref('password')],
            defineMessage({
                id: 'validation.passwordsMatch',
                message: 'As senhas não correspondem'
            })
        )
});
