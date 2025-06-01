import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DeleteAppointmentDialog({ openDeleteConfirm, handleCloseDeleteConfirm, handleDelete, isRecurrentEvent }) {
    return (
        <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{'Confirmar exclusão'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {isRecurrentEvent
                        ? 'Este agendamento faz parte de uma série recorrente. Deseja excluir apenas este ou toda a série?'
                        : 'Você tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {isRecurrentEvent ? (
                    <>
                        <Button onClick={() => handleDelete('single')} color="primary">
                            Somente este
                        </Button>
                        <Button onClick={() => handleDelete('series')} color="primary" autoFocus>
                            Toda a série
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => handleDelete('single')} color="primary" autoFocus>
                        Confirmar exclusão
                    </Button>
                )}

                <Button onClick={handleCloseDeleteConfirm} color="primary">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
