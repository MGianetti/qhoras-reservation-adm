import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function UpdateRecurrenceDialog({ scopeDialogOpen, setScopeDialogOpen, doUpdate }) {
    return (
        <Dialog open={scopeDialogOpen} onClose={() => setScopeDialogOpen(false)}>
            <DialogTitle>Editar recorrência</DialogTitle>
            <DialogContent>
                <DialogContentText>Você deseja editar somente este evento ou toda a série recorrente?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => doUpdate('single')}>Somente este</Button>
                <Button onClick={() => doUpdate('series')} autoFocus>
                    Toda a série
                </Button>
            </DialogActions>
        </Dialog>
    );
}
