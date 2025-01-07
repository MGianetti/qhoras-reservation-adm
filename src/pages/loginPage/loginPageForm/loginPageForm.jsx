import { useState } from 'react';
import { useFormik } from 'formik';
import { useTheme } from '@mui/styles';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Button, CardMedia, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Box, Stack, Typography } from '@mui/material';

import logoB from 'src/assets/images/logo-b.png';
import authService from '../../../infraestructure/auth/authService';

import { validationSchema } from './loginPageForm.constants';
import { useNavigate } from 'react-router-dom';

const LoginPageForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const isLoginSucceeded = await authService.login({ email: values.email, password: values.password });
            if (isLoginSucceeded) navigate('/');
        }
    });

    return (
        <Box sx={{ py: 6, px: 4, bgcolor: '#FFF', borderRadius: 2, width: 380, boxShadow: theme.shadows[0] }}>
            <Stack
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                noValidate
                autoComplete="off"
            >
                <CardMedia component="img" sx={{ width: 200 }} image={logoB} alt="Logo QHoras" />
                <Typography variant="subtitle2" sx={{ m: 2, pt: 2, color: theme.palette.primary.main }}>
                    Faça login para continuar
                </Typography>
                <FormControl fullWidth sx={{ m: 2 }} variant="outlined">
                    <InputLabel size="small" required htmlFor="email">
                        Email
                    </InputLabel>
                    <OutlinedInput
                        id="email"
                        size="small"
                        type="email"
                        label="Email"
                        {...formik.getFieldProps('email')}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <Typography variant="caption" color="error">
                            {formik.errors.email}
                        </Typography>
                    ) : null}
                </FormControl>
                <FormControl fullWidth sx={{ m: 2 }} variant="outlined">
                    <InputLabel size="small" required htmlFor="outlined-adornment-password">
                        Senha
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        size="small"
                        required
                        type={showPassword ? 'text' : 'password'}
                        label="Senha"
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
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Entrar
                </Button>
                <Link href="/esqueci-senha" variant="subtitle2" sx={{ pt: 2 }}>
                    Esqueci minha senha
                </Link>
            </Stack>
        </Box>
    );
};

export default LoginPageForm;
