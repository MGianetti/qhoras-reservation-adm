import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required('Digite o nome do serviço.'),
    price: Yup.string().required('Digite o preço do serviço.'),
    duration: Yup.string().required('Digite a duração do serviço.'),
    loyaltyPoints: Yup.number().required('Digite os pontos de fidelidade do serviço.')
});

export const formatServicePayload = (values) => {
    const price = values.price / 100; 
    return {
        name: values.name,
        price: price,
        duration: values.duration,
        loyaltyPoints: Number(values.loyaltyPoints),
        status: values.status,
        startingFrom: values.startingFrom
    };
};