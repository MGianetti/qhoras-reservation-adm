import { defineMessage } from '@lingui/core/macro';

export const requestPasswordResetSuccess = {
    message: defineMessage({
        id: 'common.requestPasswordResetSuccess',
        message: 'Se esse email existir na base, confira sua caixa de entrada.'
    }),
    type: 'success'
};

export const passwordResetSuccess = {
    message: defineMessage({
        id: 'common.passwordResetSuccess',
        message: 'Sua senha foi alterada com sucesso.'
    }),
    type: 'success'
};

export const requestPasswordResetFail = {
    message: defineMessage({
        id: 'common.requestPasswordResetFail',
        message: 'Erro ao solicitar! Por favor, tente novamente.'
    }),
    type: 'error'
};

export const resetNewPasswordSuccess = {
    message: defineMessage({
        id: 'common.resetNewPasswordSuccess',
        message: 'Senha resetada com sucesso!'
    }),
    type: 'success'
};

export const resetNewPasswordFail = {
    message: defineMessage({
        id: 'common.resetNewPasswordFail',
        message: 'Erro ao resetar senha! Verifique os dados informados.'
    }),
    type: 'error'
};

export const hasLoginSuccess = {
    message: defineMessage({
        id: 'common.hasLoginSuccess',
        message: 'Login efetuado com sucesso!'
    }),
    type: 'success'
};

export const hasLoginFail = {
    message: defineMessage({
        id: 'common.hasLoginFail',
        message: 'Erro ao efetuar login. Tente novamente.'
    }),
    type: 'error'
};

export const requestGetUserFail = {
    message: defineMessage({
        id: 'common.requestGetUserFail',
        message: 'Erro ao buscar dados. Tente novamente.'
    }),
    type: 'error'
};
