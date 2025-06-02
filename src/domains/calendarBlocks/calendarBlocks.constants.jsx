import { defineMessage } from '@lingui/core/macro';

export const createdCalendarBlockSuccess = {
    message: defineMessage({
        id: 'common.createdCalendarBlockSuccess',
        message: 'Caso não haja conflito de horário, o bloqueio foi criado com sucesso!'
    }),
    type: 'success'
};

export const createdCalendarBlockFail = {
    message: defineMessage({
        id: 'common.createdCalendarBlockFail',
        message: 'Falha ao criar bloqueio!'
    }),
    type: 'error'
};

export const deletedCalendarBlockSuccess = {
    message: defineMessage({
        id: 'common.deletedCalendarBlockSuccess',
        message: 'Bloqueio removido com sucesso!'
    }),
    type: 'success'
};

export const deletedCalendarBlockFail = {
    message: defineMessage({
        id: 'common.deletedCalendarBlockFail',
        message: 'Falha ao remover bloqueio!'
    }),
    type: 'error'
};
