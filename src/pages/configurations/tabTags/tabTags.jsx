import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Grid, Stack, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, CircularProgress, Box, useTheme } from '@mui/material';
import { IoAdd } from 'react-icons/io5';

import tagService from '../../../domains/tags/tagsService';
import DeleteTagModal from '../../../common/components/modals/deleteTagModal/deleteTagModal';

const CardGroup = styled(Stack)`
    background: #ffffff;
    border-radius: 8px;
`;

export default function TabTags() {
    const theme = useTheme();
    const { businessId } = useSelector((s) => s.auth.user) || {};
    const { data: tags = [], isLoading } = useSelector((s) => s.tags);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', color: '#000000' });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    if (!businessId) {
        return (
            <Box
                sx={{
                    height: '60vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    useEffect(() => {
        tagService.read(businessId);
    }, [businessId]);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', color: '#000000' });
        setDialogOpen(true);
    };
    const openEdit = (tag) => {
        setEditing(tag);
        setForm({ name: tag.name, color: tag.color });
        setDialogOpen(true);
    };
    const closeDialog = () => setDialogOpen(false);

    const handleSubmit = async () => {
        if (editing) {
            await tagService.update(businessId, editing.id, form);
        } else {
            await tagService.create(businessId, form);
        }
        closeDialog();
    };

    const openDelete = (tag) => {
        setTagToDelete(tag);
        setDeleteDialogOpen(true);
    };
    const closeDelete = () => {
        setDeleteDialogOpen(false);
        setTagToDelete(null);
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <CardGroup spacing={2} sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Etiquetas</Typography>
                            <Button variant="contained" startIcon={<IoAdd />} onClick={openCreate}>
                                Nova etiqueta
                            </Button>
                        </Stack>

                        {isLoading ? (
                            <Typography align="center" variant="body2" color="textSecondary">
                                Carregando…
                            </Typography>
                        ) : tags.length > 0 ? (
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag.id}
                                        label={tag.name}
                                        onClick={() => openEdit(tag)}
                                        onDelete={() => openDelete(tag)}
                                        sx={{
                                            backgroundColor: tag.color,
                                            color: theme.palette.getContrastText(tag.color),
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography align="center" variant="body2" color="textSecondary">
                                Nenhuma etiqueta cadastrada.
                            </Typography>
                        )}
                    </CardGroup>
                </Grid>

                <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="xs">
                    <DialogTitle>{editing ? 'Editar etiqueta' : 'Nova etiqueta'}</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={2} sx={{ pt: 1 }} >
                            <TextField label="Nome da etiqueta" fullWidth value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography>Cor:</Typography>
                                <input
                                    type="color"
                                    value={form.color}
                                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                                    style={{ width: 32, height: 32, border: 'none', padding: 0, cursor: 'pointer' }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {form.color.toUpperCase()}
                                </Typography>
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pb: 2 }}>
                        <Button onClick={closeDialog}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={!form.name.trim()}>
                            {editing ? 'Salvar' : 'Criar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>

            <DeleteTagModal isOpen={deleteDialogOpen} tag={tagToDelete} businessId={businessId} onClose={closeDelete} />
        </>
    );
}
