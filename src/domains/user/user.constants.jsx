import { defineMessage } from '@lingui/core/macro';

export const updatedUserConfigSuccess = {
    message: defineMessage({
        id: 'common.updatedUserConfigSuccess',
        message: 'Configurações atualizadas com sucesso!'
    }),
    type: 'success'
};

export const updatedUserConfigFail = {
    message: defineMessage({
        id: 'common.updatedUserConfigFail',
        message: 'Falha ao atualizar configurações!'
    }),
    type: 'error'
};

export const companyUpdatedSuccess = {
    message: defineMessage({
        id: 'common.companyUpdatedSuccess',
        message: 'Dados da empresa atualizados com sucesso!'
    }),
    type: 'success'
};

export const companyUpdatedFail = {
    message: defineMessage({
        id: 'common.companyUpdatedFail',
        message: 'Falha ao atualizar dados da empresa!'
    }),
    type: 'error'
};
