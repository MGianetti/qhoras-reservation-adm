import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Typography } from '@mui/material';
import tagService from '../../../../domains/tags/tagsService';

const DeleteTagModal = ({ isOpen, tag, businessId, onClose }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await tagService.remove(businessId, tag.id);
        onClose();
    };

    if (!tag) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', pt: 2, gap: 2 }}>
                    <Typography variant="body1">
                        Tem certeza que deseja excluir a etiqueta <strong>{tag.name}</strong>?
                    </Typography>
                    <DialogActions>
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="error">
                            Apagar
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteTagModal;
