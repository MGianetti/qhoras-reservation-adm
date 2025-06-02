import { defineMessage } from '@lingui/core/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    email: Yup.string()
        .email(
            defineMessage({
                id: 'validation.emailInvalid',
                message: 'Digite um email válido'
            })
        )
        .required(
            defineMessage({
                id: 'validation.emailRequired',
                message: 'O email é obrigatório'
            })
        ),
    password: Yup.string()
        .min(
            8,
            defineMessage({
                id: 'validation.passwordMinLength',
                message: 'A senha deve ter no mínimo 8 caracteres'
            })
        )
        .required(
            defineMessage({
                id: 'validation.passwordRequired',
                message: 'A senha é obrigatória'
            })
        )
});
