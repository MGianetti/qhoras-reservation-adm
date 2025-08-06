import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { IoStorefrontOutline, IoPricetagOutline } from 'react-icons/io5';

import TabEstablishment from './tabEstablishment/tabEstablishment';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';
import TabTags from './tabTags/tabTags';

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <LoggedLayout>
            <Box sx={{ width: '100%', pt: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="icon position tabs example" sx={{ minHeight: 'unset' }}>
                        <Tab
                            icon={<IoPricetagOutline size={17} />}
                            iconPosition="start"
                            label="Etiquetas"
                            sx={{
                                fontSize: 14,
                                textTransform: 'none',
                                minHeight: 20,
                                fontWeight: 'unset',
                                paddingLeft: 1,
                                paddingRight: 1
                            }}
                            {...a11yProps(0)}
                        />

                        <Tab
                            icon={<IoStorefrontOutline size={17} />}
                            iconPosition="start"
                            label="Estabelecimento"
                            sx={{
                                fontSize: 14,
                                textTransform: 'none',
                                minHeight: 20,
                                fontWeight: 'unset'
                            }}
                            {...a11yProps(1)}
                        />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <TabTags />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <TabEstablishment />
                </CustomTabPanel>
            </Box>
        </LoggedLayout>
    );
}
