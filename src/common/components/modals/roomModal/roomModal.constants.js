import * as Yup from 'yup';

export const validationSchema = Yup.object({
    name: Yup.string().required('Digite o nome da sala.'),
    price: Yup.string().required('Digite o preço da sala.'),
    capacity: Yup.string().required('Digite a capacidade da sala.'),
});

export const formatRoomPayload = (values) => {
    const price = values.price / 100; 
    return {
        name: values.name,
        price: price,
        capacity: values.capacity,
        status: values.status,
    };
};