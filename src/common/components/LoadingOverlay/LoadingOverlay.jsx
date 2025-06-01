import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingOverlay = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <CircularProgress size={70} sx={{ color: '#0D47A1' }} />
        </Box>
    );
};

export default LoadingOverlay;
