import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Typography } from '@mui/material';

import servicesService from '../../../../domains/services/servicesService';

const DeleteServiceModal = (props) => {
    const { isOpen, deleteRowValues, handleClose } = props;

    const handleSubmit = (e) => {
        e.preventDefault();
        servicesService.deleteService(deleteRowValues.id);
        handleClose();
    };

    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={isOpen} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', m: 'auto', pt: 2, gap: 3 }}>
                        <Typography variant="body1">Tem certeza que deseja excluir o serviço <strong>{deleteRowValues?.name}</strong>?</Typography>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                Apagar
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteServiceModal;
