import * as Yup from 'yup';
import dayjs from 'dayjs';
import { defineMessage } from '@lingui/core/macro';

const validationSchema = Yup.object().shape({
    initialDate: Yup.date()
        .nullable()
        .required(
            defineMessage({
                id: 'validation.initialDateRequired',
                message: 'Data inicial é obrigatória'
            })
        ),

    endDate: Yup.date()
        .nullable()
        .when('initialDate', (initialDate, schema) => {
            if (!initialDate) {
                return schema.nullable();
            }
            return schema.min(
                initialDate,
                defineMessage({
                    id: 'validation.endDateMin',
                    message: 'A data final deve ser maior ou igual à data inicial'
                })
            );
        }),

    timeRange: Yup.array()
        .of(Yup.mixed().nullable())
        .test(
            'validTimeRange',
            defineMessage({
                id: 'validation.timeRangeInvalid',
                message: 'O horário final deve ser maior que o horário inicial'
            }),
            function (value) {
                if (!value || !value[0] || !value[1]) return true;
                const [start, end] = value;
                return dayjs(end).isAfter(dayjs(start));
            }
        )
});

export default validationSchema;
