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
        label: 'Preço',
        minWidth: 170,
        align: 'center'
    },
    {
        id: 'loyaltyPoints',
        label: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
                Pontos Fidelidade{' '}
                <StyledTooltip
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#824d9e', borderRadius: '50%', padding: 2 }}
                    placement="bottom-start"
                    title="Quantidade de pontos que o serviço dará ao cliente. Esses pontos são acumulados e podem ser convertidos em descontos ou serviços para seu cliente."
                >
                    <IconButton>
                        <FaRegCircleQuestion fontSize={16} style={{ color: '#ffffff', cursor: 'pointer' }} />
                    </IconButton>
                </StyledTooltip>
            </div>
        ),
        minWidth: 190,
        align: 'center'
    },
    {
        id: 'duration',
        label: 'Duração',
        minWidth: 170,
        align: 'center'
    },
    {
        id: 'actions',
        label: 'Ações',
        minWidth: 170,
        align: 'center'
    }
];

function createData(name, statusBoolean, priceNumber, loyaltyPointsNumber, durationNumber) {

    const price = moneyMask(priceNumber);
    const loyaltyPoints = `${loyaltyPointsNumber} pts`;
    const duration = formatDuration(durationNumber);
    const status = statusBoolean ? 'Ativo' : 'Inativo';
    return { name, status, price, duration, loyaltyPoints };
}

export const rows = (serviceList = []) => {
    return serviceList.map((service) => createData(service.name, service.status, service.price, service.loyaltyPoints, service.duration));
};
