import { Trans } from '@lingui/react/macro';

export const requestPasswordResetSuccess = {
    message: Trans`Se esse email existir na base, confira sua caixa de entrada.`,
    type: `success`
};

export const passwordResetSuccess = {
    message: Trans`Sua senha foi alterada com sucesso.`,
    type: `success`
};

export const requestPasswordResetFail = {
    message: Trans`Erro ao solicitar! Por favor, tente novamente.`,
    type: `error`
};

export const resetNewPasswordSuccess = {
    message: Trans`Senha resetada com sucesso!`,
    type: `success`
};

export const resetNewPasswordFail = {
    message: Trans`Erro ao resetar senha! Verifique os dados informados.`,
    type: `error`
};

export const hasLoginSuccess = {
    message: Trans`Login efetuado com sucesso!`,
    type: `success`
};

export const hasLoginFail = {
    message: Trans`Erro ao efetuar login. Tente novamente.`,
    type: `error`
};

export const requestGetUserFail = {
    message: Trans`Erro ao buscar dados. Tente novamente.`,
    type: `error`
};
