export const createdAppointmentSuccess = Object.freeze({
  message: "Agendamento criado com sucesso!",
  type: "success",
});

export const createdAppointmentFail = Object.freeze({
  message: "Falha ao criar agendamento!",
  type: "error",
});

export const updatedAppointmentSuccess = Object.freeze({
  message: "Agendamento atualizado com sucesso!",
  type: "success",
});

export const updatedAppointmentFail = Object.freeze({
  message: "Falha ao atualizar agendamento!",
  type: "error",
});

export const deletedAppointmentSuccess = Object.freeze({
  message: "Agendamento excluído com sucesso!",
  type: "success",
});

export const deletedAppointmentFail = Object.freeze({
  message: "Falha ao excluir agendamento!",
  type: "error",
});

export const appointmentConflict = Object.freeze({
  message: "O horário selecionado conflita com outro agendamento.",
  type: "error",
});

export const appointmentOutsideBusinessHours = Object.freeze({
  message: "O horário selecionado está fora do horário de funcionamento.",
  type: "error",
});

export const refreshCalendarSuccess = Object.freeze({
  message: "Agendamentos atualizados com sucesso!",
  type: "success",
});
