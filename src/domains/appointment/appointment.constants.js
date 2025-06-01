import { Trans } from '@lingui/react/macro';

export const createdAppointmentSuccess = Object.freeze({
    message: Trans`Agendamento criado com sucesso!`,
    type: `success`
});

export const createdAppointmentFail = Object.freeze({
    message: Trans`Falha ao criar agendamento!`,
    type: `error`
});

export const updatedAppointmentSuccess = Object.freeze({
    message: Trans`Agendamento atualizado com sucesso!`,
    type: `success`
});

export const updatedAppointmentFail = Object.freeze({
    message: Trans`Falha ao atualizar agendamento!`,
    type: `error`
});

export const deletedAppointmentSuccess = Object.freeze({
    message: Trans`Agendamento excluído com sucesso!`,
    type: `success`
});

export const deletedAppointmentFail = Object.freeze({
    message: Trans`Falha ao excluir agendamento!`,
    type: `error`
});

export const appointmentConflict = Object.freeze({
    message: Trans`O horário selecionado conflita com outro agendamento.`,
    type: `error`
});

export const appointmentOutsideBusinessHours = Object.freeze({
    message: Trans`O horário selecionado está fora do horário de funcionamento.`,
    type: `error`
});

export const refreshCalendarSuccess = Object.freeze({
    message: Trans`Agendamentos atualizados com sucesso!`,
    type: `success`
});

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
