import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { IoFilter } from 'react-icons/io5';
import { styled } from '@mui/material/styles';
import { badgeClasses } from '@mui/material/Badge';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Button, Popover, Toolbar, Badge, TextField } from '@mui/material';

import { FILTER_FIELDS, STATUS_LIST } from './enhancedTableToolbar.constants';

export function EnhancedTableToolbar({ handleApplyFilters }) {
    const [filters, setFilters] = useState([{ field: '', value: '', from: '', to: '' }]);

    const appliedCount = filters.filter((f) => {
        if (!f.field) return false;
        if (f.field === 'date' || f.field === 'createdAt') {
            return f.from && f.to;
        }
        return f.value;
    }).length;

    const CartBadge = styled(Badge)`
        & .${badgeClasses.badge} {
            top: -12px;
            right: -6px;
        }
    `;

    return (
        <Toolbar sx={{ pl: { xs: 2, sm: 2 }, pr: { xs: 2, sm: 4 } }}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6">
                Lista de eventos
            </Typography>

            <PopupState variant="popover" popupId="filter-popover">
                {(popup) => (
                    <>
                        <IconButton {...bindTrigger(popup)} color="primary">
                            <IoFilter size={24} />
                            <CartBadge badgeContent={appliedCount} color="primary" overlap="circular" />
                        </IconButton>

                        <Popover
                            {...bindPopover(popup)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            slotProps={{ paper: { sx: { width: 520, p: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.15)' } } }}
                        >
                            <FilterContent onClose={popup.close} handleApplyFilters={handleApplyFilters} filters={filters} setFilters={setFilters} />
                        </Popover>
                    </>
                )}
            </PopupState>
        </Toolbar>
    );
}

function FilterContent({ onClose, handleApplyFilters, filters, setFilters }) {
    const { data: rooms = [] } = useSelector((state) => state.rooms) || {};

    const isApplyDisabled = filters.some((f) => {
        if (!f.field) return true;
        if (f.field === 'date' || f.field === 'createdAt') {
            if (!f.from || !f.to) return true;
            return new Date(f.to) < new Date(f.from);
        }
        return !f.value;
    });

    const handleAdd = () => setFilters((prev) => [...prev, { field: '', value: '', from: '', to: '' }]);
    const handleRemove = (i) => setFilters((prev) => prev.filter((_, idx) => idx !== i));
    const handleField = (i, field) => setFilters((prev) => prev.map((r, idx) => (idx === i ? { field, value: '', from: '', to: '' } : r)));
    const handleValue = (i, value) => setFilters((prev) => prev.map((r, idx) => (idx === i ? { ...r, value } : r)));
    const handleFrom = (i, from) => setFilters((prev) => prev.map((r, idx) => (idx === i ? { ...r, from } : r)));
    const handleTo = (i, to) => setFilters((prev) => prev.map((r, idx) => (idx === i ? { ...r, to } : r)));

    const handleClear = () => {
        setFilters([{ field: '', value: '', from: '', to: '' }]);
        handleApplyFilters([{ field: '', value: '', from: '', to: '' }]);
        onClose();
    };

    const handleApply = () => {
        handleApplyFilters(filters);
        onClose();
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Filtros
            </Typography>

            {filters.map((f, idx) => {
                const wrongDate = (f.field === 'date' || f.field === 'createdAt') && f.from && f.to && new Date(f.to) < new Date(f.from);

                const baseOptions = f.field === 'rooms' ? rooms : f.field === 'status' ? STATUS_LIST : [];

                const usedValues = filters.filter((r, i) => i !== idx && r.field === f.field && r.value).map((r) => r.value);

                const availableOptions = baseOptions.filter((opt) => opt.id === f.value || !usedValues.includes(opt.id));

                return (
                    <Box key={idx} display="flex" alignItems="center" mb={1} gap={1}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Filtro</InputLabel>
                            <Select value={f.field} label="Filtro" onChange={(e) => handleField(idx, e.target.value)}>
                                {FILTER_FIELDS.map((ff) => (
                                    <MenuItem key={ff.id} value={ff.id}>
                                        {ff.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {f.field === 'date' || f.field === 'createdAt' ? (
                            <>
                                <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    value={f.from}
                                    onChange={(e) => handleFrom(idx, e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    error={wrongDate}
                                />
                                <TextField
                                    type="date"
                                    size="small"
                                    fullWidth
                                    value={f.to}
                                    onChange={(e) => handleTo(idx, e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    error={wrongDate}
                                    helperText={wrongDate ? '"Até" deve ser igual ou depois de "De"' : ''}
                                />
                            </>
                        ) : (
                            <FormControl size="small" fullWidth disabled={!f.field}>
                                <InputLabel>Opção</InputLabel>
                                <Select value={f.value} label="Opção" onChange={(e) => handleValue(idx, e.target.value)}>
                                    {availableOptions.map((opt) => (
                                        <MenuItem key={opt.id} value={opt.id}>
                                            {opt.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {filters.length > 1 && (
                            <IconButton size="small" onClick={() => handleRemove(idx)}>
                                <MdDelete />
                            </IconButton>
                        )}
                    </Box>
                );
            })}

            <Button startIcon={<IoFilter />} size="small" onClick={handleAdd} sx={{ mb: 2 }}>
                Adicionar Filtro
            </Button>

            <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button onClick={handleClear}>Limpar</Button>
                <Button variant="contained" onClick={handleApply} disabled={isApplyDisabled}>
                    Aplicar
                </Button>
            </Box>
        </Box>
    );
}
