import { Trans } from '@lingui/react/macro';

export const createdAppointmentSuccess = {
    message: Trans`Agendamento criado com sucesso!`,
    type: `success`
};

export const createdAppointmentFail = {
    message: Trans`Falha ao criar agendamento!`,
    type: `error`
};

export const updatedAppointmentSuccess = {
    message: Trans`Agendamento atualizado com sucesso!`,
    type: `success`
};

export const updatedAppointmentFail = {
    message: Trans`Falha ao atualizar agendamento!`,
    type: `error`
};

export const deletedAppointmentSuccess = {
    message: Trans`Agendamento excluído com sucesso!`,
    type: `success`
};

export const deletedAppointmentFail = {
    message: Trans`Falha ao excluir agendamento!`,
    type: `error`
};

export const appointmentConflict = {
    message: Trans`O horário selecionado conflita com outro agendamento.`,
    type: `error`
};

export const appointmentOutsideBusinessHours = {
    message: Trans`O horário selecionado está fora do horário de funcionamento.`,
    type: `error`
};

export const refreshCalendarSuccess = {
    message: Trans`Agendamentos atualizados com sucesso!`,
    type: `success`
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
