import { Trans } from '@lingui/react/macro';

export const createdCalendarBlockSuccess = Object.freeze({
    message: Trans`Caso não haja conflito de horário, o bloqueio foi criado com sucesso!`,
    type: `success`
});

export const createdCalendarBlockFail = Object.freeze({
    message: Trans`Falha ao criar bloqueio!`,
    type: `error`
});

export const deletedCalendarBlockSuccess = Object.freeze({
    message: Trans`Bloqueio removido com sucesso!`,
    type: `success`
});

export const deletedCalendarBlockFail = Object.freeze({
    message: Trans`Falha ao remover bloqueio!`,
    type: `error`
});
