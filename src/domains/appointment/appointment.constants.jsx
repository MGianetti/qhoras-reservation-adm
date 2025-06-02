import { defineMessage } from '@lingui/core/macro';

export const createdAppointmentSuccess = {
    message: defineMessage({
        id: 'common.createdAppointmentSuccess',
        message: 'Agendamento criado com sucesso!'
    }),
    type: 'success'
};

export const createdAppointmentFail = {
    message: defineMessage({
        id: 'common.createdAppointmentFail',
        message: 'Falha ao criar agendamento!'
    }),
    type: 'error'
};

export const updatedAppointmentSuccess = {
    message: defineMessage({
        id: 'common.updatedAppointmentSuccess',
        message: 'Agendamento atualizado com sucesso!'
    }),
    type: 'success'
};

export const updatedAppointmentFail = {
    message: defineMessage({
        id: 'common.updatedAppointmentFail',
        message: 'Falha ao atualizar agendamento!'
    }),
    type: 'error'
};

export const deletedAppointmentSuccess = {
    message: defineMessage({
        id: 'common.deletedAppointmentSuccess',
        message: 'Agendamento excluído com sucesso!'
    }),
    type: 'success'
};

export const deletedAppointmentFail = {
    message: defineMessage({
        id: 'common.deletedAppointmentFail',
        message: 'Falha ao excluir agendamento!'
    }),
    type: 'error'
};

export const appointmentConflict = {
    message: defineMessage({
        id: 'common.appointmentConflict',
        message: 'O horário selecionado conflita com outro agendamento.'
    }),
    type: 'error'
};

export const appointmentOutsideBusinessHours = {
    message: defineMessage({
        id: 'common.appointmentOutsideBusinessHours',
        message: 'O horário selecionado está fora do horário de funcionamento.'
    }),
    type: 'error'
};

export const refreshCalendarSuccess = {
    message: defineMessage({
        id: 'common.refreshCalendarSuccess',
        message: 'Agendamentos atualizados com sucesso!'
    }),
    type: 'success'
};

export const RECURRENCE_TYPES = {
    NONE: `NONE`,
    DAILY: `DAILY`,
    WEEKLY: `WEEKLY`,
    WEEKDAYS: `WEEKDAYS`,
    MONTHLY_BY_DATE: `MONTHLY_BY_DATE`,
    MONTHLY_BY_ORDINAL: `MONTHLY_BY_ORDINAL`,
    YEARLY_BY_DATE: `YEARLY_BY_DATE`,
    YEARLY_BY_ORDINAL: `YEARLY_BY_ORDINAL`
};
