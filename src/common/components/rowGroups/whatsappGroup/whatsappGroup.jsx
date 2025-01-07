import { Box, Button, CardMedia, FormLabel, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import qrcode from 'qrcode';
import whatsappRepository from '../../../../domains/whatsapp/whatsappRepository';
import logoB from 'src/assets/images/logo-b.png';

const WhatsappGroup = () => {
    const [qrCode, setQrCode] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [isClientActive, setIsClientActive] = useState(false);

    const userId = useSelector((state) => state.auth.user.id);

    useEffect(() => {
        const checkClientStatus = async () => {
            try {
                const response = await whatsappRepository.checkWhatsAppHeartbeat(userId);
                setIsClientActive(response.active);
    
                if (!response.active) {
                    await handleInitializeClient();
                }
            } catch (err) {
                console.error('Error checking WhatsApp client heartbeat:', err);
                setError('Falha ao verificar o status do cliente WhatsApp.');
            }
        };
    
        checkClientStatus();
    }, [userId]);

    const handleInitializeClient = async () => {
        setIsInitializing(true);
        setError(null);
        try {
            const response = await whatsappRepository.initializeWhatsAppClient(userId);
    
            if (response && response.qrCode) {
                const qrCodeBase64 = await qrcode.toDataURL(response.qrCode);
                setQrCode(qrCodeBase64);
            } else if (response.qrCode === null) {
                setError('Falha ao inicializar o cliente WhatsApp');
            }
        } catch (error) {
            console.error('Error initializing WhatsApp client:', error);
            setError('Ocorreu um erro ao inicializar o cliente WhatsApp');
        } finally {
            setIsInitializing(false);
        }
    };

    const handleDeleteClient = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await whatsappRepository.deleteWhatsAppClient(userId);
            setQrCode(null);
            setIsClientActive(false);
        } catch (error) {
            console.error('Error deleting WhatsApp client:', error);
            setError('Ocorreu um erro ao deletar o cliente WhatsApp');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <FormLabel component="legend" sx={{ mb: 2 }}>
                WhatsApp
            </FormLabel>
            <Grid container alignItems={'center'} justifyContent={'space-between'}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" sx={{ color: '#606062' }}>
                        {qrCode ? 'Escaneie o QR Code abaixo para ativar seu WhatsApp!' : isClientActive ? <span style={{ color: 'green', fontSize: '1.4em' }}>WhatsApp está ativo!</span> : <span style={{ color: 'red', fontSize: '1.4em' }}>Seu WhatsApp não está conectado!</span>}
                    </Typography>
    
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
    
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={isClientActive ? handleDeleteClient : handleInitializeClient}
                        disabled={isInitializing || isDeleting}
                    >
                        {isInitializing ? 'Gerando QR Code...' : isDeleting ? 'Deletando...' : isClientActive ? 'Desconectar WhatsApp' : 'Conectar WhatsApp'}
                    </Button>
                </Box>
    
                {qrCode ? (
                    <CardMedia
                        component="img"
                        sx={{ width: '200px' }}
                        image={qrCode}
                        alt="QR Code para WhatsApp"
                    />
                ) : (
                    <CardMedia
                        component="img"
                        sx={{ width: '200px' }}
                        image={logoB}
                        alt="Logo QHoras"
                    />
                )}
            </Grid>
        </>
    );
    
};

export default WhatsappGroup;
