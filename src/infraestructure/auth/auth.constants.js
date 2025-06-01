import { Trans } from '@lingui/react/macro';

export const requestPasswordResetSuccess = Object.freeze({
    message: Trans`Se esse email existir na base, confira sua caixa de entrada.`,
    type: `success`
});

export const passwordResetSuccess = Object.freeze({
    message: Trans`Sua senha foi alterada com sucesso.`,
    type: `success`
});

export const requestPasswordResetFail = Object.freeze({
    message: Trans`Erro ao solicitar! Por favor, tente novamente.`,
    type: `error`
});

export const resetNewPasswordSuccess = Object.freeze({
    message: Trans`Senha resetada com sucesso!`,
    type: `success`
});

export const resetNewPasswordFail = Object.freeze({
    message: Trans`Erro ao resetar senha! Verifique os dados informados.`,
    type: `error`
});

export const hasLoginSuccess = Object.freeze({
    message: Trans`Login efetuado com sucesso!`,
    type: `success`
});

export const hasLoginFail = Object.freeze({
    message: Trans`Erro ao efetuar login. Tente novamente.`,
    type: `error`
});

export const requestGetUserFail = Object.freeze({
    message: Trans`Erro ao buscar dados. Tente novamente.`,
    type: `error`
});
