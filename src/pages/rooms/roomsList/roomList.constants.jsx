import { styled } from '@mui/material/styles';
import { FaRegCircleQuestion } from 'react-icons/fa6';

import moneyMask from '../../../common/masks/moneyMask';
import formatDuration from '../../../common/masks/durationMask';
import { IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(53, 53, 53, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 12
    }
}));

export const columns = [
    {
        id: 'name',
        label: 'Nome',
        minWidth: 170,
        align: 'left'
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 170,
        align: 'center'
    },
    {
        id: 'price',
        label: 'Taxa',
        minWidth: 170,
        align: 'center'
    },
    {
        id: 'capacity',
        label: 'Capacidade',
        minWidth: 170,
        align: 'center'
    }
];

function createData(name, statusBoolean, priceNumber, capacityNumber) {
    const price = moneyMask(priceNumber);
    const capacity = `${capacityNumber} pessoas`;
    const status = statusBoolean ? 'Ativo' : 'Inativo';
    return { name, status, price, capacity };
}

export const rows = (roomList = []) => {
    return roomList.map((room) => createData(room.name, room.status, room.price, room.capacity));
};
