import { Trans } from '@lingui/react/macro';

export const createdCalendarBlockSuccess = {
    message: Trans`Caso não haja conflito de horário, o bloqueio foi criado com sucesso!`,
    type: `success`
};

export const createdCalendarBlockFail = {
    message: Trans`Falha ao criar bloqueio!`,
    type: `error`
};

export const deletedCalendarBlockSuccess = {
    message: Trans`Bloqueio removido com sucesso!`,
    type: `success`
};

export const deletedCalendarBlockFail = {
    message: Trans`Falha ao remover bloqueio!`,
    type: `error`
};
