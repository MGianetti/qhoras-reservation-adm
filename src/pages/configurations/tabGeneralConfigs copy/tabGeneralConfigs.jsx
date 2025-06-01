import { Grid } from '@mui/material';
import { useTheme } from '@mui/styles';

import OperationGroup from '../../../common/components/operationGroup/operationGroup';
import AdditionalSettingsGroup from '../../../common/components/rowGroups/additionalSettingsGroup/additionalSettingsGroup';

import styles from './tabGeneralConfigs.module.scss';

function TabGeneralConfigs() {
    const theme = useTheme();
    return (
        <Grid container>
            <Grid item xs={12} sx={{ boxShadow: theme.shadows[0] }} className={styles.cardGroup}>
                <OperationGroup />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2, boxShadow: theme.shadows[0] }} className={styles.cardGroup}>
                <AdditionalSettingsGroup />
            </Grid>
        </Grid>
    );
}

export default TabGeneralConfigs;
