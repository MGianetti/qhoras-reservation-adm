import { Grid } from '@mui/material';

import ForgotPasswordForm from './forgotPasswordForm/forgotPasswordForm';
import HalfScreenLogin from '../../common/components/halfScreenLogin/halfScreenLogin';

function LoginPage() {
    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid
                item
                md={12}
                container
                justifyContent="center"
                alignItems="center"
                sx={{
                    bgcolor: '#f3f5f8'
                }}
            >
                <ForgotPasswordForm />
            </Grid>
        </Grid>
    );
}

export default LoginPage;
