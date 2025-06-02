import { styled } from '@mui/material/styles';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import moneyMask from '../../../common/masks/moneyMask';
import formatDuration from '../../../common/masks/durationMask';
import { IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { defineMessage } from '@lingui/core/macro';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(53, 53, 53, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));

export const columns = [
  {
    id: 'name',
    label: defineMessage({
      id: 'table.header.name',
      message: 'Nome',
    }),
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'status',
    label: defineMessage({
      id: 'table.header.status',
      message: 'Status',
    }),
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'price',
    label: defineMessage({
      id: 'table.header.price',
      message: 'Taxa',
    }),
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'capacity',
    label: defineMessage({
      id: 'table.header.capacity',
      message: 'Capacidade',
    }),
    minWidth: 170,
    align: 'center',
  },
];

function createData(name, statusBoolean, priceNumber, capacityNumber) {
  const price = moneyMask(priceNumber);
  const capacity = `${capacityNumber} ` + defineMessage({
    id: 'table.capacitySuffix',
    message: 'pessoas',
  });
  const status = statusBoolean
    ? defineMessage({
        id: 'table.statusActive',
        message: 'Ativo',
      })
    : defineMessage({
        id: 'table.statusInactive',
        message: 'Inativo',
      });
  return { name, status, price, capacity };
}

export const rows = (roomList = []) => {
  return roomList.map((room) =>
    createData(room.name, room.status, room.price, room.capacity)
  );
};
