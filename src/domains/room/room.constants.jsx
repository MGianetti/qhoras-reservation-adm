import { defineMessage } from '@lingui/core/macro';

export const createdRoomSuccess = {
    message: defineMessage({
        id: 'common.createdRoomSuccess',
        message: 'Sala criada com sucesso!'
    }),
    type: 'success'
};

export const createdRoomFail = {
    message: defineMessage({
        id: 'common.createdRoomFail',
        message: 'Falha ao criar sala!'
    }),
    type: 'error'
};

export const updatedRoomSuccess = {
    message: defineMessage({
        id: 'common.updatedRoomSuccess',
        message: 'Sala atualizada com sucesso!'
    }),
    type: 'success'
};

export const updatedRoomFail = {
    message: defineMessage({
        id: 'common.updatedRoomFail',
        message: 'Falha ao atualizar sala!'
    }),
    type: 'error'
};

export const deletedRoomSuccess = {
    message: defineMessage({
        id: 'common.deletedRoomSuccess',
        message: 'Sala deletada com sucesso!'
    }),
    type: 'success'
};

export const deletedRoomFail = {
    message: defineMessage({
        id: 'common.deletedRoomFail',
        message: 'Falha ao deletar sala!'
    }),
    type: 'error'
};
