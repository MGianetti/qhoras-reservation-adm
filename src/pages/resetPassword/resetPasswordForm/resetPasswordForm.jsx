import { useState } from 'react';
import { useFormik } from 'formik';
import { useTheme } from '@mui/styles';
import { useLocation } from 'react-router';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Button, CardMedia, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../../infraestructure/auth/authService';
import { validationSchema } from './resetPasswordForm.constants';
import logoB from 'src/assets/images/logo-b.png';

const ResetPasswordForm = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleMouseDownPassword = (event) => event.preventDefault();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const data = authService.sendNewPassword(values.password, token);

            if (data) {
                navigate('/');
            }
        }
    });

    return (
        <Box
            sx={{
                py: 6,
                px: 4,
                bgcolor: '#FFF',
                borderRadius: 2,
                width: 380,
                boxShadow: theme.shadows[0]
            }}
        >
            <Stack
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <CardMedia component="img" sx={{ width: 200 }} image={logoB} alt="Logo QHoras" />
                <Typography
                    variant="subtitle2"
                    sx={{
                        m: 4,
                        pt: 2,
                        color: theme.palette.primary.main,
                        fontSize: '1.5rem'
                    }}
                >
                    Digite sua nova senha
                </Typography>
                <FormControl fullWidth sx={{ m: 2 }} variant="outlined">
                    <InputLabel size="small" required htmlFor="outlined-adornment-password">
                        Nova Senha
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        size="small"
                        required
                        type={showPassword ? 'text' : 'password'}
                        label="Nova Senha"
                        {...formik.getFieldProps('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        error={formik.touched.password && Boolean(formik.errors.password)}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <Typography variant="caption" color="error">
                            {formik.errors.password}
                        </Typography>
                    ) : null}
                </FormControl>
                <FormControl fullWidth sx={{ m: 2 }} variant="outlined">
                    <InputLabel size="small" required htmlFor="outlined-adornment-confirm-password">
                        Confirmação de Senha
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-confirm-password"
                        size="small"
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirmação de Senha"
                        {...formik.getFieldProps('confirmPassword')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <Typography variant="caption" color="error">
                            {formik.errors.confirmPassword}
                        </Typography>
                    ) : null}
                </FormControl>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Mudar senha
                </Button>
                <Link href="/" variant="subtitle2" sx={{ pt: 2 }}>
                    Faça Login
                </Link>
            </Stack>
        </Box>
    );
};

export default ResetPasswordForm;
