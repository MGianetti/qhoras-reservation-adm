import { Button, Grid, Rating, TableCell, TableRow } from '@mui/material';
import Icon from '../../../../common/components/icon/Icon';

const RenderClientCell = ({ column, value, rowIndex, row, handleClickWhatsapp }) => {
    if (column.id === 'name') {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={row.image} alt={`Imagem ${rowIndex + 1}`} width="40" height="40" style={{ marginRight: 12 }} />
                {value}
            </div>
        );
    }
    
    if (column.id === 'loyaltyPoints') {
        return <Rating name="half-rating-read" value={value} precision={0.5} readOnly />;
    }

    if (column.id === 'actions') {
        return (
            <Grid container justifyContent="center" spacing={1}>
                {/* <Grid item>
                    <Button
                        sx={{
                            p: 1,
                            minWidth: 'unset',
                            borderRadius: '50%',
                            backgroundColor: '#C00505',
                            '&:hover': { backgroundColor: '#C00505' }
                        }}
                    >
                        <Icon name="block" width={24} />
                    </Button>
                </Grid> */}
                <Grid item>
                    <Button
                        sx={{
                            p: 1,
                            minWidth: 'unset',
                            borderRadius: '50%',
                            backgroundColor: '#05C00C',
                            '&:hover': { backgroundColor: '#05C00C' }
                        }}
                        onClick={handleClickWhatsapp}
                    >
                        <Icon name="whatsapp" width={24} />
                    </Button>
                </Grid>
            </Grid>
        );
    }

    
    if (column.format && typeof value === 'number') {
        return column.format(value);
    }
    
    if(!value) return '-'

    return value;
};

export const RenderRowClientList = ({ row, columns, rowIndex, handleOpenModal, setValuesLine, unformattedData }) => {
    const handleClick = () => {
        handleOpenModal(true);
        setValuesLine(unformattedData[rowIndex]);
    };

    const handleClickWhatsapp = (e) => {
        e.stopPropagation();
        const phoneOnlyNumbers = unformattedData[rowIndex].phoneNumber.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneOnlyNumbers}`);
    };

    return (
        <TableRow hover tabIndex={-1} key={row.id} onClick={handleClick}>
            {columns.map((column) => {
                const value = row[column.id];
                return (
                    <TableCell key={column.id} align={column.align}>
                        <RenderClientCell column={column} value={value} rowIndex={rowIndex} row={row} handleClickWhatsapp={handleClickWhatsapp} />
                    </TableCell>
                );
            })}
        </TableRow>
    );
};
