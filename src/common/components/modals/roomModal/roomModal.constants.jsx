import { defineMessage } from '@lingui/core/macro';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required(
        defineMessage({
            id: 'validation.nameRequired',
            message: 'Digite o nome da sala.'
        })
    ),

    price: Yup.string().required(
        defineMessage({
            id: 'validation.priceRequired',
            message: 'Digite o preço da sala.'
        })
    ),

    capacity: Yup.number()
        .typeError(
            defineMessage({
                id: 'validation.capacityNumeric',
                message: 'Digite um valor numérico para a capacidade.'
            })
        )
        .integer(
            defineMessage({
                id: 'validation.capacityInteger',
                message: 'A capacidade deve ser um número inteiro.'
            })
        )
        .positive(
            defineMessage({
                id: 'validation.capacityPositive',
                message: 'A capacidade deve ser um número positivo.'
            })
        )
        .required(
            defineMessage({
                id: 'validation.capacityRequired',
                message: 'Digite a capacidade da sala.'
            })
        ),

    status: Yup.boolean().default(true),

    agendaConfigurations: Yup.array()
        .of(
            Yup.object().shape({
                day: Yup.string().required(
                    defineMessage({
                        id: 'validation.dayRequired',
                        message: 'Selecione o dia.'
                    })
                ),
                startTime: Yup.string().required(
                    defineMessage({
                        id: 'validation.startTimeRequired',
                        message: 'Selecione a hora de início.'
                    })
                ),
                endTime: Yup.string().required(
                    defineMessage({
                        id: 'validation.endTimeRequired',
                        message: 'Selecione a hora de término.'
                    })
                ),
                isActive: Yup.boolean().default(false)
            })
        )
        .min(
            1,
            defineMessage({
                id: 'validation.agendaConfigMin',
                message: 'Adicione pelo menos uma configuração de agenda.'
            })
        )
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
        name: defineMessage({
            id: 'common.dayMonday',
            message: 'Segunda-feira'
        }),
        value: 'MONDAY'
    },
    {
        name: defineMessage({
            id: 'common.dayTuesday',
            message: 'Terça-feira'
        }),
        value: 'TUESDAY'
    },
    {
        name: defineMessage({
            id: 'common.dayWednesday',
            message: 'Quarta-feira'
        }),
        value: 'WEDNESDAY'
    },
    {
        name: defineMessage({
            id: 'common.dayThursday',
            message: 'Quinta-feira'
        }),
        value: 'THURSDAY'
    },
    {
        name: defineMessage({
            id: 'common.dayFriday',
            message: 'Sexta-feira'
        }),
        value: 'FRIDAY'
    },
    {
        name: defineMessage({
            id: 'common.daySaturday',
            message: 'Sábado'
        }),
        value: 'SATURDAY'
    },
    {
        name: defineMessage({
            id: 'common.daySunday',
            message: 'Domingo'
        }),
        value: 'SUNDAY'
    }
];
