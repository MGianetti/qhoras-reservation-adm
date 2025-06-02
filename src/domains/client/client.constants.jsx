import { defineMessage } from '@lingui/core/macro';

export const createdClientSuccess = {
    message: defineMessage({
        id: 'common.createdClientSuccess',
        message: 'Cliente criado com sucesso!'
    }),
    type: 'success'
};

export const createdClientFail = {
    message: defineMessage({
        id: 'common.createdClientFail',
        message: 'Falha ao criar cliente!'
    }),
    type: 'error'
};

export const updatedClientSuccess = {
    message: defineMessage({
        id: 'common.updatedClientSuccess',
        message: 'Cliente atualizado com sucesso!'
    }),
    type: 'success'
};

export const updatedClientFail = {
    message: defineMessage({
        id: 'common.updatedClientFail',
        message: 'Falha ao atualizar cliente!'
    }),
    type: 'error'
};
