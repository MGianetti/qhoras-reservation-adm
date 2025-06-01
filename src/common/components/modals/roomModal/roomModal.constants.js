import { Trans } from '@lingui/react/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required(Trans`Digite o nome da sala.`),

    price: Yup.string().required(Trans`Digite o preço da sala.`),

    capacity: Yup.number()
        .typeError(Trans`Digite um valor numérico para a capacidade.`)
        .integer(Trans`A capacidade deve ser um número inteiro.`)
        .positive(Trans`A capacidade deve ser um número positivo.`)
        .required(Trans`Digite a capacidade da sala.`),

    status: Yup.boolean().default(true),

    agendaConfigurations: Yup.array()
        .of(
            Yup.object().shape({
                day: Yup.string().required(Trans`Selecione o dia.`),
                startTime: Yup.string().required(Trans`Selecione a hora de início.`),
                endTime: Yup.string().required(Trans`Selecione a hora de término.`),
                isActive: Yup.boolean().default(false)
            })
        )
        .min(1, Trans`Adicione pelo menos uma configuração de agenda.`)
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
            isActive: config.isActive
        }))
    };
};

export const days = [
    {
        name: Trans`Segunda-feira`,
        value: `MONDAY`
    },
    {
        name: Trans`Terça-feira`,
        value: `TUESDAY`
    },
    {
        name: Trans`Quarta-feira`,
        value: `WEDNESDAY`
    },
    {
        name: Trans`Quinta-feira`,
        value: `THURSDAY`
    },
    {
        name: Trans`Sexta-feira`,
        value: `FRIDAY`
    },
    {
        name: Trans`Sábado`,
        value: `SATURDAY`
    },
    {
        name: Trans`Domingo`,
        value: `SUNDAY`
    }
];
