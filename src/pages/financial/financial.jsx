import { useState } from 'react';
import { useTheme } from '@mui/styles';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';

import { dataChart } from './financial.constants';
import styles from './financial.module.scss';
import LoggedLayout from '../../common/layouts/loggedLayout/loggedLayout';

export default function Financeiro() {
    const [valuesChart, setValuesChart] = useState(dataChart[0]);
    const [isLoadingChart, setIsLoadingChart] = useState(false);

    const theme = useTheme();

    const handleSelectHistory = (e) => {
        setIsLoadingChart(true);
        setValuesChart(dataChart[e.target.value - 1]);
        setTimeout(() => {
            setIsLoadingChart(false);
        }, 500);
    };

    return (
        <LoggedLayout>
            <Grid container sx={{ boxShadow: theme.shadows[0] }} className={styles.cardGroup}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body1">{valuesChart.title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Histórico</InputLabel>
                            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={valuesChart.id} label="Histórico" onChange={(e) => handleSelectHistory(e)}>
                                {dataChart.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.select}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <LineChart
                    height={300}
                    loading={isLoadingChart}
                    series={
                        isLoadingChart
                            ? []
                            : [
                                  {
                                      data: valuesChart.data,
                                      label: 'Valor',
                                      area: true,
                                      color: theme.palette.primary.main,
                                      valueFormatter: (value) => `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                  }
                              ]
                    }
                    xAxis={[{ scaleType: 'point', data: valuesChart.label }]}
                    yAxis={[
                        {
                            valueFormatter: (value) => `${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                        }
                    ]}
                    grid={{ horizontal: true }}
                    margin={{ top: 30, left: 80 }}
                    slotProps={{ legend: { hidden: true } }}
                    sx={{
                        [`& .${areaElementClasses.root}`]: {
                            fill: theme.palette.transparent.main
                        }
                    }}
                />
            </Grid>
        </LoggedLayout>
    );
}
