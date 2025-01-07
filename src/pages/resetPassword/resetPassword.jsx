import { Grid } from '@mui/material';

import ResetPasswordForm from './resetPasswordForm/resetPasswordForm';
import HalfScreenLogin from '../../common/components/halfScreenLogin/halfScreenLogin';

function ResetPassword() {
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
                <ResetPasswordForm />
            </Grid>
        </Grid>
    );
}

export default ResetPassword;
