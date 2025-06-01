import * as Yup from 'yup';

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

export const validationSchema = Yup.object().shape({
    initialDate: Yup.date().nullable().required('Data inicial é obrigatória'),
    endDate: Yup.date()
        .nullable()
        .required('Data final é obrigatória')
        .when('initialDate', (initialDate, schema) => (initialDate ? schema.min(initialDate, 'A data final deve ser maior ou igual à data inicial') : schema))
});
