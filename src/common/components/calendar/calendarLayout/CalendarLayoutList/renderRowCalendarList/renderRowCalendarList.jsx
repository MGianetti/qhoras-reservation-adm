import { Chip, TableCell, TableRow } from '@mui/material';

const RenderCalendarCell = ({ column, value }) => {
    if (column.id === 'status') {
        return <Chip label={value} color={value === 'Pendente' ? 'warning' : value === 'Agendado' ? 'info' : value === 'Concluído' ? 'success' : 'error'} />;
    }

    if (column.format && typeof value === 'number') {
        return column.format(value);
    }

    if (!value) return '-';

    return value;
};

export const RenderRowCalendarList = ({ row, columns, rowIndex, handleClickLine, unformattedData }) => {
    const handleClick = () => {
        handleClickLine(true);
    };

    return (
        <TableRow hover tabIndex={-1} key={row.id} onClick={handleClick}>
            {columns.map((column) => {
                const value = row[column.id];

                return (
                    <TableCell key={column.id} align={column.align}>
                        <RenderCalendarCell column={column} value={value} />
                    </TableCell>
                );
            })}
        </TableRow>
    );
};
