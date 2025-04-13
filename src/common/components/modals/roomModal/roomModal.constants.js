import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string().required("Digite o nome da sala."),

  price: Yup.string().required("Digite o preço da sala."),

  capacity: Yup.number()
    .typeError("Digite um valor numérico para a capacidade.")
    .integer("A capacidade deve ser um número inteiro.")
    .positive("A capacidade deve ser um número positivo.")
    .required("Digite a capacidade da sala."),

  status: Yup.boolean().default(true),

  agendaConfigurations: Yup.array()
    .of(
      Yup.object().shape({
        day: Yup.string().required("Selecione o dia."),
        startTime: Yup.string().required("Selecione a hora de início."),
        endTime: Yup.string().required("Selecione a hora de término."),
        isActive: Yup.boolean().default(false),
      }),
    )
    .min(1, "Adicione pelo menos uma configuração de agenda."),
});

export const formatRoomPayload = (values) => {
  const { name, price, capacity, status, agendaConfigurations = [] } = values;

  const normalizedPrice = price / 100;

  return {
    name,
    price: normalizedPrice,
    capacity,
    status,
    agendaConfigurations: agendaConfigurations.map((config) => ({
      day: config.day,
      startTime: config.startTime,
      endTime: config.endTime,
      isActive: config.isActive,
    })),
  };
};

export const days = [
  {
    name: "Segunda-feira",
    value: "MONDAY",
  },
  {
    name: "Terça-feira",
    value: "TUESDAY",
  },
  {
    name: "Quarta-feira",
    value: "WEDNESDAY",
  },
  {
    name: "Quinta-feira",
    value: "THURSDAY",
  },
  {
    name: "Sexta-feira",
    value: "FRIDAY",
  },
  {
    name: "Sábado",
    value: "SATURDAY",
  },
  {
    name: "Domingo",
    value: "SUNDAY",
  },
];
