import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Typography } from '@mui/material';

import roomService from '../../../../domains/room/roomService';
import { Trans } from '@lingui/react/macro';

const DeleteRoomModal = (props) => {
    const { isOpen, deleteRowValues, handleClose } = props;

    const handleSubmit = (e) => {
        e.preventDefault();
        roomService.deleteRoom(deleteRowValues.id);
        handleClose();
    };

    return (
        <>
            <Dialog maxWidth="sm" fullWidth={true} open={isOpen} onClose={handleClose}>
                <DialogTitle id="responsive-dialog-title">
                    <Trans>Confirmar exclusão</Trans>
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            pt: 2,
                            gap: 3
                        }}
                    >
                        <Typography variant="body1">
                            <Trans>Tem certeza que deseja excluir o serviço</Trans> <strong>{deleteRowValues?.name}</strong>?
                        </Typography>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                <Trans>Cancelar</Trans>
                            </Button>
                            <Button autoFocus type="submit" variant="contained">
                                <Trans>Apagar</Trans>
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteRoomModal;
