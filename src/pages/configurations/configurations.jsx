import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { IoStorefrontOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import TabEstablishment from './tabEstablishment/tabEstablishment';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';
import { Trans } from '@lingui/react/macro';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function Configurations() {
    const [value, setValue] = useState(0);

    const { id: businessId } = useSelector((state) => state?.auth.user) || {
        businessId: undefined
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <LoggedLayout>
            <Box sx={{ width: '100%', pt: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="configurações tabs" sx={{ minHeight: 'unset' }}>
                        <Tab
                            icon={<IoStorefrontOutline size={17} />}
                            iconPosition="start"
                            label={<Trans>Estabelecimento</Trans>}
                            sx={{
                                fontSize: 14,
                                textTransform: 'none',
                                minHeight: 20,
                                fontWeight: 'unset'
                            }}
                            {...a11yProps(0)}
                        />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <TabEstablishment />
                </CustomTabPanel>
            </Box>
        </LoggedLayout>
    );
}
