import avatar1 from 'src/assets/images/avatar-1.png';
import avatar2 from 'src/assets/images/avatar-2.png';
import avatar3 from 'src/assets/images/avatar-3.png';
import avatar4 from 'src/assets/images/avatar-4.png';
import avatar5 from 'src/assets/images/avatar-5.png';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const columns = [
    {
        id: 'name',
        label: 'Nome',
        minWidth: 190,
        align: 'left'
    },
    {
        id: 'email',
        label: 'E-mail',
        minWidth: 220,
        align: 'left'
    },
    {
        id: 'phone',
        label: 'Telefone',
        minWidth: 170,
        align: 'left'
    },
    {
        id: 'lastReservation',
        label: 'Última Reserva',
        minWidth: 170,
        align: 'left'
    },
    {
        id: 'actions',
        label: 'Ações',
        minWidth: 170,
        align: 'center'
    }
];

function getRandomImage() {
    const imageNumber = Math.floor(Math.random() * avatars.length);
    return avatars[imageNumber];
}

function createData(name, email, phone, lastReservationDate, loyaltyPoints) {
    const image = getRandomImage();
    const lastReservation = lastReservationDate ? new Date(lastReservationDate).toLocaleDateString('pt-BR') : 'Sem reservas';
    return { image, name, email, phone, lastReservation, loyaltyPoints };
}

export const rows = (clientList = []) => {
    return clientList.map((client) => createData(client.name, client.email ?? '', client.phoneNumber, client.lastReservationDate, client.loyaltyPoints));
};
